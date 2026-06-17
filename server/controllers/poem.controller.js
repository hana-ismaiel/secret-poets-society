const pool = require("../db");

const createPoem = async (req, res) => {
  const { title, content, anonymous } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newPoem = await pool.query(
      `INSERT INTO poems (title, content, anonymous, user_id) VALUES ($1, $2, $3, $4) 
      RETURNING id, title, content, anonymous, created_at`,
      [title, content, anonymous ?? false, userId]
    );

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
  const { title, content, anonymous } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
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
      `UPDATE poems SET title = $1, content = $2, anonymous = $3, modified_at = NOW() WHERE id = $4
      RETURNING id, title, content, anonymous, created_at, modified_at`,
      [title, content, anonymous ?? poem.rows[0].anonymous, id]
    );

    res.status(201).json(editedPoem.rows[0]);

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
        poems.anonymous,
        poems.created_at,
        CASE 
          WHEN poems.anonymous = true THEN 'Anonymous'
          ELSE users.username
        END AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      ORDER BY poems.created_at DESC`
    );

    res.status(200).json(poems.rows);

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
        poems.anonymous,
        poems.created_at,
        CASE 
          WHEN poems.anonymous = true THEN 'Anonymous'
          ELSE users.username
        END AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      WHERE poems.id = $1`,
      [id]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    res.status(200).json(poem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific user's poems
const getUserPoems = async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.user?.id;
  const viewingOwnProfile = loggedInUserId === userId;

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
        poems.anonymous,
        poems.created_at,
        poems.modified_at,
        users.username AS author
      FROM poems
      JOIN users ON poems.user_id = users.id
      WHERE poems.user_id = $1
      ${viewingOwnProfile ? '' : 'AND poems.anonymous = false'}
      ORDER BY poems.created_at DESC`,
      [userId]
    );

    res.status(200).json(poems.rows);

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