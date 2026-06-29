const pool = require("../db");

const POEMS_PER_PAGE = 1;
const attachThemes = require("../utils/attachThemes");

const createPoem = async (req, res) => {
  const { title, content, themeIds, isAiGenerated } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (themeIds && themeIds.length > 3) {
    return res.status(400).json({ message: "You can select up to 3 themes" });
  }

  try {
    const newPoem = await pool.query(
      `INSERT INTO poems (title, content, user_id, is_ai_generated) VALUES ($1, $2, $3, $4) 
      RETURNING id, title, content, created_at, is_ai_generated`,
      [title, content, userId, isAiGenerated ?? false]
    );

    if (themeIds && themeIds.length > 0) {
      for (const themeId of themeIds) {
        await pool.query(
          "INSERT INTO poem_themes (poem_id, theme_id) VALUES ($1, $2)",
          [newPoem.rows[0].id, themeId]
        );
      }
    }

    res.status(201).json(newPoem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePoem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const poem = await pool.query(
      "SELECT * FROM poems WHERE id = $1",
      [id]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    if (poem.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own poems" });
    }

    await pool.query(
      "DELETE FROM poems WHERE id = $1",
      [id]
    );

    res.status(200).json({ message: "Poem deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const editPoem = async (req, res) => {
  const { id } = req.params;
  const { title, content, themeIds } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (themeIds && themeIds.length > 3) {
    return res.status(400).json({ message: "You can select up to 3 themes" });
  }

  const userId = req.user.id;

  try {
    const poem = await pool.query(
      "SELECT * FROM poems WHERE id = $1",
      [id]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    if (poem.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only edit your own poems" });
    }

    const editedPoem = await pool.query(
      `UPDATE poems SET title = $1, content = $2, modified_at = NOW() WHERE id = $3
      RETURNING id, title, content, created_at, modified_at`,
      [title, content, id]
    );

    if (themeIds) {
      await pool.query(
        "DELETE FROM poem_themes WHERE poem_id = $1", // Remove existing themes for that poem
        [id]
      );

      for (const themeId of themeIds) {
        await pool.query(
          "INSERT INTO poem_themes (poem_id, theme_id) VALUES ($1, $2)",
          [id, themeId]
        );
      }
    }

    res.status(200).json(editedPoem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllPoems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query("SELECT COUNT(*) FROM poems");
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);

    const poems = await pool.query(
      `SELECT
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      ORDER BY poems.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPoemById = async (req, res) => {
  try {
    const { id } = req.params;

    const poem = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      WHERE poems.id = $1`,
      [id]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const poemThemes = await pool.query(
      `SELECT 
        themes.id,
        themes.name
      FROM poem_themes
      JOIN themes ON poem_themes.theme_id = themes.id
      WHERE poem_themes.poem_id = $1`,
      [id]
    );

    poem.rows[0].themes = poemThemes.rows.map(poemTheme => ({ id: poemTheme.id, name: poemTheme.name }));

    res.status(200).json(poem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific user's poems
const getUserPoems = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const userExists = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM poems WHERE user_id = $1",
      [userId]
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);

    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.modified_at,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      WHERE poems.user_id = $1
      ORDER BY poems.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPoemsByTheme = async (req, res) => {
  const { themeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const theme = await pool.query(
      "SELECT id, name FROM themes WHERE id = $1",
      [themeId]
    );

    if (theme.rows.length === 0) {
      return res.status(404).json({ message: "Theme not found" });
    }

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM poem_themes WHERE theme_id = $1",
      [themeId]
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);

    // Find the poems that are tagged with the chosen theme
    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      JOIN poem_themes ON poems.id = poem_themes.poem_id
      WHERE poem_themes.theme_id = $1
      ORDER BY poems.created_at DESC
      LIMIT $2 OFFSET $3`,
      [themeId, limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      theme: theme.rows[0],
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPopularPoems = async (req, res) => {
  const timeframe = req.query.timeframe; // "24h", "7d", or "all"
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  let timeCondition = "";

  // SQL constraint based on request query
  if (timeframe === "24h") {
    timeCondition = "WHERE likes.created_at >= NOW() - INTERVAL '1 day'";
  } else if (timeframe === "7d") {
    timeCondition = "WHERE likes.created_at >= NOW() - INTERVAL '7 days'";
  }

  try {
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT poems.id) FROM poems
       LEFT JOIN likes ON poems.id = likes.poem_id
       ${timeCondition}`
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);
    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author,
        COUNT(likes.id)::int AS like_count
      FROM poems
      JOIN users ON poems.user_id = users.id
      LEFT JOIN likes ON poems.id = likes.poem_id
      ${timeCondition}
      GROUP BY poems.id, users.username
      ORDER BY like_count DESC, poems.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get poems by users that you follow
const getFollowingFeed = async (req, res) => {
  const followerId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT poems.id) FROM poems
      JOIN follows ON poems.user_id = follows.following_id
      WHERE follows.follower_id = $1`,
      [followerId]
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);

    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      JOIN follows ON follows.following_id = poems.user_id
      WHERE follows.follower_id = $1
      ORDER BY poems.created_at DESC
      LIMIT $2 OFFSET $3`,
      [followerId, limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserLikes = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT poems.id) FROM poems
      JOIN likes ON poems.id = likes.poem_id
      WHERE likes.user_id = $1`,
      [userId]
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);
    
    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        likes.created_at AS liked_at,
        users.username AS author,
        poems.user_id AS author_id
      FROM likes
      JOIN poems ON likes.poem_id = poems.id
      JOIN users ON poems.user_id = users.id
      WHERE likes.user_id = $1
      ORDER BY likes.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserSaves = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT poems.id) FROM poems
      JOIN saves ON poems.id = saves.poem_id
      WHERE saves.user_id = $1`,
      [userId]
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);

    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author,
        saves.created_at AS saved_at
      FROM saves
      JOIN poems ON saves.poem_id = poems.id
      JOIN users ON poems.user_id = users.id
      WHERE saves.user_id = $1
      ORDER BY saves.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchPoems = async (req, res) => {
  const q = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || POEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  if (!q || !q.trim()) {
    return res.status(400).json({ message: "Search query cannot be empty" });
  }

  const searchTerm = `%${q.trim()}%`;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM poems
       WHERE title ILIKE $1 OR content ILIKE $1`,
      [searchTerm]
    );
    const totalPoems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPoems / limit);

    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.is_ai_generated,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      WHERE poems.title ILIKE $1 OR poems.content ILIKE $1
      ORDER BY poems.created_at DESC
      LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset]
    );

    const poemsWithThemes = await attachThemes(poems.rows);

    res.status(200).json({
      poems: poemsWithThemes,
      pagination: {
        totalPoems,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPoem,
  deletePoem,
  editPoem,
  getAllPoems,
  getPoemById,
  getUserPoems,
  getPoemsByTheme,
  getPopularPoems,
  getFollowingFeed,
  getUserLikes,
  getUserSaves,
  searchPoems
};