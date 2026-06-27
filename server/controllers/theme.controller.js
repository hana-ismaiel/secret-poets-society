const pool = require("../db");

const getThemes = async (req, res) => {
  try {
    const themes = await pool.query(
      "SELECT id, name, pathname FROM themes ORDER BY name ASC"
    );

    res.status(200).json(themes.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getThemeByPathname = async (req, res) => {
  const { pathname } = req.params;
  try {
    const theme = await pool.query(
      "SELECT id, name, pathname FROM themes WHERE pathname = $1",
      [pathname]
    );
    if (theme.rows.length === 0) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json(theme.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getThemes, getThemeByPathname };