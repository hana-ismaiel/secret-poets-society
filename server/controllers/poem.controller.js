const pool = require("../db");

const createPoem = async (req, res) => {
  const { title, content, anonymous } = req.body;
  const user_id = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newPoem = await pool.query(
      `INSERT INTO poems (title, content, anonymous, user_id) VALUES ($1, $2, $3, $4) 
      RETURNING id, title, content, anonymous, created_at`,
      [title, content, anonymous ?? false, user_id]
    );

    res.status(201).json(newPoem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePoem = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const poem = await pool.query(
      "SELECT * FROM poems WHERE id = $1",
      [id]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    if (poem.rows[0].user_id !== user_id) {
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

module.exports = { createPoem, deletePoem };