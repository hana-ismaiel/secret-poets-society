const pool = require("../db");

const POEMS_PER_PAGE = 1;

// Like / unlike a poem
const toggleLike = async (req, res) => {
  const { poemId } = req.params;
  const userId = req.user.id;

  try {
    const poem = await pool.query(
      "SELECT id FROM poems WHERE id = $1",
      [poemId]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Check if this user already liked this poem
    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND poem_id = $2",
      [userId, poemId]
    );

    if (existingLike.rows.length > 0) {
      // Already liked — so unlike it
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND poem_id = $2",
        [userId, poemId]
      );

      return res.status(200).json({ liked: false, message: "Poem unliked" });
    }

    // Not liked yet — so like it
    await pool.query(
      "INSERT INTO likes (user_id, poem_id) VALUES ($1, $2)",
      [userId, poemId]
    );

    res.status(200).json({ liked: true, message: "Poem liked" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get like count for a poem
const getLikeCount = async (req, res) => {
  const { poemId } = req.params;

  try {
    const poem = await pool.query(
      "SELECT id FROM poems WHERE id = $1",
      [poemId]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const likeCount = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE poem_id = $1",
      [poemId]
    );

    res.status(200).json({ count: parseInt(likeCount.rows[0].count) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if current user liked a specific poem
const checkUserLiked = async (req, res) => {
  const { poemId } = req.params;
  const userId = req.user.id;

  try {
    const userLiked = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND poem_id = $2",
      [userId, poemId]
    );

    res.status(200).json({ liked: userLiked.rows.length > 0 });

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
    
    const userLikes = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
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

    const poemIds = userLikes.rows.map(poem => poem.id);
    let poemCategories = { rows: [] };
    
    if (poemIds.length > 0) {
      poemCategories = await pool.query(
        `SELECT 
          poem_categories.poem_id,
          categories.id,
          categories.name
        FROM poem_categories
        JOIN categories ON poem_categories.category_id = categories.id
        WHERE poem_categories.poem_id = ANY($1)`,
        [poemIds]
      );
    }

    const poemsWithCategories = userLikes.rows.map(poem => ({
      ...poem,
      categories: poemCategories.rows
        .filter(poemCategory => poemCategory.poem_id === poem.id)
        .map(poemCategory => ({ id: poemCategory.id, name: poemCategory.name }))
    }));

    res.status(200).json({
      poems: poemsWithCategories,
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

module.exports = { toggleLike, getLikeCount, checkUserLiked, getUserLikes };