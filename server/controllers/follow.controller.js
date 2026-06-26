const pool = require("../db");

const POEMS_PER_PAGE = 1;

const toggleFollow = async (req, res) => {
  const { followingId } = req.params; // the person being followed/unfollowed
  const followerId = req.user.id; // the person doing the following

  if (followingId === followerId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const userToFollow = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [followingId]
    );

    if (userToFollow.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingFollow = await pool.query(
      "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    if (existingFollow.rows.length > 0) {
      await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
        [followerId, followingId]
      );

      return res.status(200).json({ following: false, message: "Unfollowed" });
    }

    await pool.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)",
      [followerId, followingId]
    );

    res.status(200).json({ following: true, message: "Followed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const checkIsFollowing = async (req, res) => {
  const { followingId } = req.params;
  const followerId = req.user.id;

  try {
    const existingFollow = await pool.query(
      "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    res.status(200).json({ following: existingFollow.rows.length > 0 });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Number of followers a user has
const getFollowerCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const count = await pool.query(
      "SELECT COUNT(*) FROM follows WHERE following_id = $1",
      [userId]
    );

    res.status(200).json({ count: parseInt(count.rows[0].count) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Number of people a user follows
const getFollowingCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const count = await pool.query(
      "SELECT COUNT(*) FROM follows WHERE follower_id = $1",
      [userId]
    );

    res.status(200).json({ count: parseInt(count.rows[0].count) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get posts by users that you follow
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

    const poemIds = poems.rows.map(poem => poem.id);
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

    const poemsWithCategories = poems.rows.map(poem => ({
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

const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await pool.query(
      `SELECT users.id, users.username, users.created_at
       FROM follows
       JOIN users ON follows.follower_id = users.id
       WHERE follows.following_id = $1
       ORDER BY follows.created_at DESC`,
      [userId]
    );

    res.status(200).json(followers.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await pool.query(
      `SELECT users.id, users.username, users.created_at
       FROM follows
       JOIN users ON follows.following_id = users.id
       WHERE follows.follower_id = $1
       ORDER BY follows.created_at DESC`,
      [userId]
    );

    res.status(200).json(following.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  toggleFollow,
  checkIsFollowing,
  getFollowerCount,
  getFollowingCount,
  getFollowingFeed,
  getFollowers,
  getFollowing,
};