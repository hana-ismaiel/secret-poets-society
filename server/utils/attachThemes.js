const pool = require("../db");

const attachThemes = async (poems) => {
  if (!poems || poems.length === 0) {
    return [];
  }

  const poemIds = poems.map(poem => poem.id);

  const poemThemes = await pool.query(
    `SELECT 
      poem_themes.poem_id,
      themes.id,
      themes.name
    FROM poem_themes
    JOIN themes ON poem_themes.theme_id = themes.id
    WHERE poem_themes.poem_id = ANY($1)`,
    [poemIds]
  );

  return poems.map(poem => ({
    ...poem,
    themes: poemThemes.rows
      .filter(poemTheme => poemTheme.poem_id === poem.id)
      .map(poemTheme => ({ id: poemTheme.id, name: poemTheme.name }))
  }));
};

module.exports = attachThemes;