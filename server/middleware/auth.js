const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  // Get token from request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication failed - no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user info request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed - invalid or expired token" });
  }
};

module.exports = authenticateToken;