const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const USERS_PER_PAGE = 30;
const ALLOWED_AVATAR_COLORS = [
  "red", "orange", "yellow", "lime", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "pink", "rose"
];

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (username.length > 50) {
    return res.status(400).json({ message: "Username must be 50 characters or less" });
  }
  if (username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters" });
  }
  if (email.length > 254) {
    return res.status(400).json({ message: "Email must be 254 characters or less" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    // Check if username already exists in database
    const existingUsername = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Check if email already exists in database
    const existingEmail= await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {

    const foundUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (foundUser.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const user = foundUser.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    
    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await pool.query(
      "SELECT id, username, created_at, bio, avatar_color FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  const q = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || USERS_PER_PAGE;
  const offset = (page - 1) * limit;

  if (!q || !q.trim()) {
    return res.status(400).json({ message: "Search query cannot be empty" });
  }

  const searchTerm = `%${q.trim()}%`;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users
       WHERE username ILIKE $1`,
      [searchTerm]
    );
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await pool.query(
      `SELECT id, username, created_at, bio, avatar_color
      FROM users
      WHERE username ILIKE $1
      ORDER BY username ASC
      LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset]
    );

    res.status(200).json({
      users: users.rows,
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

const updateBio = async (req, res) => {
  const userId = req.user.id;
  const { bio } = req.body;

  // Validation
  if (bio === undefined) {
    return res.status(400).json({ message: "Bio content body is required" });
  }
  if (bio.length > 500) {
    return res.status(400).json({ message: "Bio must be 500 characters or less" });
  }

  try {
    const updatedUser = await pool.query(
      `UPDATE users SET bio = $1 WHERE id = $2 
      RETURNING id, username, email, bio, created_at, avatar_color`,
      [bio.trim(), userId]
    );

    res.status(200).json(updatedUser.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAvatarColor = async (req, res) => {
  const { avatarColor } = req.body;
  const userId = req.user.id;

  if (!ALLOWED_AVATAR_COLORS.includes(avatarColor)) {
    return res.status(400).json({ message: "Invalid avatar color" });
  }

  try {
    const updatedUser = await pool.query(
      `UPDATE users SET avatar_color = $1 WHERE id = $2 
      RETURNING id, username, email, created_at, bio, avatar_color`,
      [avatarColor, userId]
    );

    res.status(200).json(updatedUser.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getUserById, searchUsers, updateBio, updateAvatarColor };