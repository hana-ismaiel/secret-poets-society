const pool = require("../db");

const createPoem = async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (categoryIds && categoryIds.length > 3) {
    return res.status(400).json({ message: "You can select up to 3 categories" });
  }

  try {
    const newPoem = await pool.query(
      `INSERT INTO poems (title, content, user_id) VALUES ($1, $2, $3) 
      RETURNING id, title, content, created_at`,
      [title, content, userId]
    );

    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await pool.query(
          "INSERT INTO poem_categories (poem_id, category_id) VALUES ($1, $2)",
          [newPoem.rows[0].id, categoryId]
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
  const { title, content, categoryIds } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (categoryIds && categoryIds.length > 3) {
    return res.status(400).json({ message: "You can select up to 3 categories" });
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

    if (categoryIds) {
      await pool.query(
        "DELETE FROM poem_categories WHERE poem_id = $1", // Remove existing categories for that poem
        [id]
      );

      for (const categoryId of categoryIds) {
        await pool.query(
          "INSERT INTO poem_categories (poem_id, category_id) VALUES ($1, $2)",
          [id, categoryId]
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
  try {
    const poems = await pool.query(
      `SELECT
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      ORDER BY poems.created_at DESC`
    );

    const poemCategories = await pool.query(
      `SELECT 
        poem_categories.poem_id,
        categories.id,
        categories.name
      FROM poem_categories
      JOIN categories ON poem_categories.category_id = categories.id`
    );

    // Append categories to each poem
    const poemsWithCategories = poems.rows.map(poem => ({
      ...poem,
      categories: poemCategories.rows
        .filter(poemCategory => poemCategory.poem_id === poem.id)
        .map(poemCategory => ({ id: poemCategory.id, name: poemCategory.name }))
    }));

    res.status(200).json(poemsWithCategories);

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

    const poemCategories = await pool.query(
      `SELECT 
        categories.id,
        categories.name
      FROM poem_categories
      JOIN categories ON poem_categories.category_id = categories.id
      WHERE poem_categories.poem_id = $1`,
      [id]
    );

    poem.rows[0].categories = poemCategories.rows.map(poemCategory => ({ id: poemCategory.id, name: poemCategory.name }));

    res.status(200).json(poem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific user's poems
const getUserPoems = async (req, res) => {
  const { userId } = req.params;

  try {
    const userExists = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const poems = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.modified_at,
        poems.user_id AS author_id,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      WHERE poems.user_id = $1
      ORDER BY poems.created_at DESC`,
      [userId]
    );

    const poemCategories = await pool.query(
      `SELECT 
        poem_categories.poem_id,
        categories.id,
        categories.name
      FROM poem_categories
      JOIN categories ON poem_categories.category_id = categories.id`
    );

    // Append categories to each poem
    const poemsWithCategories = poems.rows.map(poem => ({
      ...poem,
      categories: poemCategories.rows
        .filter(poemCategory => poemCategory.poem_id === poem.id)
        .map(poemCategory => ({ id: poemCategory.id, name: poemCategory.name }))
    }));

    res.status(200).json(poemsWithCategories);

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
  getUserPoems
};