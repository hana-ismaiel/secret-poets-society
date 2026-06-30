const pool = require("../db");

const USERS_PER_PAGE = 30;

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

const getFollowers = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || USERS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM follows
      WHERE follows.following_id = $1`,
      [userId]
    );
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    const followers = await pool.query(
      `SELECT users.id, users.username, users.created_at, users.bio, users.avatar_color
       FROM follows
       JOIN users ON follows.follower_id = users.id
       WHERE follows.following_id = $1
       ORDER BY follows.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.status(200).json({
      users: followers.rows,
      pagination: {
        totalUsers,
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

const getFollowing = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || USERS_PER_PAGE;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM follows
      WHERE follows.follower_id = $1`,
      [userId]
    );
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    const following = await pool.query(
      `SELECT users.id, users.username, users.created_at, users.bio, users.avatar_color
       FROM follows
       JOIN users ON follows.following_id = users.id
       WHERE follows.follower_id = $1
       ORDER BY follows.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.status(200).json({
      users: following.rows,
      pagination: {
        totalUsers,
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
  toggleFollow,
  checkIsFollowing,
  getFollowerCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
};