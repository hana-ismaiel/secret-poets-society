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

    // Cannot save own poem
    if (poem.rows[0].user_id === userId) {
      return res.status(400).json({ message: "You cannot save your own poem" });
    }

    // Check if this user already saved this poem
    const existingSave = await pool.query(
      "SELECT * FROM saves WHERE user_id = $1 AND poem_id = $2",
      [userId, poemId]
    );

    if (existingSave.rows.length > 0) {
      // Already saved — so unsave it
      await pool.query(
        "DELETE FROM saves WHERE user_id = $1 AND poem_id = $2",
        [userId, poemId]
      );

      return res.status(200).json({ saved: false, message: "Poem unsaved" });
    }

    // Not saved yet — so save it
    await pool.query(
      "INSERT INTO saves (user_id, poem_id) VALUES ($1, $2)",
      [userId, poemId]
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
      "SELECT * FROM saves WHERE user_id = $1 AND poem_id = $2",
      [userId, poemId]
    );

    res.status(200).json({ saved: userSaved.rows.length > 0 });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { toggleSaved, checkUserSaved };