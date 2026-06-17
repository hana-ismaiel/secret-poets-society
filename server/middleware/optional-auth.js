const jwt = require("jsonwebtoken");
require("dotenv").config();

const optionalAuth = (req, res, next) => {
  // Get token from request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(); // Continue without user
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user info request
    req.user = decoded;
  } catch (error) {
    // Do nothing - continue without user
  }
  next();
};

module.exports = optionalAuth;