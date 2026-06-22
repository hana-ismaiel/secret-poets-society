const pool = require("../db");

// Save / unsave a poem
const toggleSaved = async (req, res) => {
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

    // Check if this user already saved this poem
    const existingSave = await pool.query(
      "SELECT * FROM saved_poems WHERE user_id = $1 AND poem_id = $2",
      [userId, poemId]
    );

    if (existingSave.rows.length > 0) {
      // Already saved — so unsave it
      await pool.query(
        "DELETE FROM saved_poems WHERE user_id = $1 AND poem_id = $2",
        [userId, poemId]
      );

      return res.status(200).json({ saved: false, message: "Poem unsaved" });
    }

    // Not saved yet — so save it
    await pool.query(
      "INSERT INTO saved_poems (user_id, poem_id) VALUES ($1, $2)",
      [user_id, poemId]
    );

    res.status(200).json({ saved: true, message: "Poem saved" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if current user saved a specific poem
const checkUserSaved = async (req, res) => {
  const { poemId } = req.params;
  const userId = req.user.id;

  try {
    const userSaved = await pool.query(
      "SELECT * FROM saved_poems WHERE user_id = $1 AND poem_id = $2",
      [userId, poemId]
    );

    res.status(200).json({ saved: userSaved.rows.length > 0 });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserSaves = async (req, res) => {
  const userId = req.user.id;

  try {
    const userSaves = await pool.query(
      `SELECT 
        poems.id,
        poems.title,
        poems.content,
        poems.created_at,
        poems.user_id AS author_id,
        users.username AS author,
        saved_poems.created_at AS saved_at
      FROM saved_poems
      JOIN poems ON saved_poems.poem_id = poems.id
      JOIN users ON poems.user_id = users.id
      WHERE saved_poems.user_id = $1
      ORDER BY saved_poems.created_at DESC`,
      [userId]
    );

    res.status(200).json(userSaves.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { toggleSaved, checkUserSaved, getUserSaves };