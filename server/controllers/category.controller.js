const pool = require("../db");

const getCategories = async (req, res) => {
  try {
    const categories = await pool.query(
      "SELECT id, name FROM categories ORDER BY name ASC"
    );

    res.status(200).json(categories.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCategories };