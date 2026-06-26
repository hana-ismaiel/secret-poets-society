const pool = require("../db");

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

module.exports = { toggleLike, getLikeCount, checkUserLiked };