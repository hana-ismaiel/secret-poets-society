const pool = require("../db");

const attachCategories = async (poems) => {
  if (!poems || poems.length === 0) {
    return [];
  }

  const poemIds = poems.map(poem => poem.id);

  const poemCategories = await pool.query(
    `SELECT 
      poem_categories.poem_id,
      categories.id,
      categories.name
    FROM poem_categories
    JOIN categories ON poem_categories.category_id = categories.id
    WHERE poem_categories.poem_id = ANY($1)`,
    [poemIds]
  );

  return poems.map(poem => ({
    ...poem,
    categories: poemCategories.rows
      .filter(poemCategory => poemCategory.poem_id === poem.id)
      .map(poemCategory => ({ id: poemCategory.id, name: poemCategory.name }))
  }));
};

module.exports = attachCategories;