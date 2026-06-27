const pool = require("./db");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const NUM_USERS = 15;
const NUM_POEMS = 40;
const MAX_LIKES_PER_POEM = 10;
const MAX_COMMENTS_PER_POEM = 5;
const MAX_FOLLOWS_PER_USER = 5;
const MAX_SAVED_POEMS_PER_USER = 8;

async function seedDatabase() {
  try {
    // Fetch existing themes
    const themeRes = await pool.query("SELECT id FROM themes");
    const themeIds = themeRes.rows.map(row => row.id);

    if (themeIds.length === 0) {
      console.log("No themes found in themes table.");
      process.exit(1);
    }

    // Clear existing data
    console.log("Clearing existing data...");
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM likes");
    await pool.query("DELETE FROM saved_poems");
    await pool.query("DELETE FROM follows");
    await pool.query("DELETE FROM poem_themes");
    await pool.query("DELETE FROM poems");
    await pool.query("DELETE FROM users");

    // Seed users
    console.log(`Seeding ${NUM_USERS} users...`);
    const userIds = [];
    const hashedPassword = await bcrypt.hash("password123", 10);
    for (let i = 0; i < NUM_USERS; i++) {
      const username = faker.internet.username();
      const email = faker.internet.email();
      const createdAt = faker.date.past({ years: 1 });

      const userRes = await pool.query(
        "INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING id",
        [username, email, hashedPassword, createdAt]
      );
      userIds.push(userRes.rows[0].id);
    }

    // Seed follows
    console.log("Seeding follows...");
    for (const followerId of userIds) {
      const numFollows = faker.number.int({ min: 0, max: MAX_FOLLOWS_PER_USER });
      const possibleFollows = userIds.filter((id) => id !== followerId);
      const following = faker.helpers.arrayElements(possibleFollows, Math.min(numFollows, possibleFollows.length));

      for (const followingId of following) {
        await pool.query(
          "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [followerId, followingId]
        );
      }
    }

    // Seed poems
    console.log(`Seeding ${NUM_POEMS} poems...`);
    const poemIds = [];
    for (let i = 0; i < NUM_POEMS; i++) {
      const randomAuthorId = faker.helpers.arrayElement(userIds);
      const title = faker.lorem.words({ min: 2, max: 5 });
      const content = faker.lorem.paragraphs(3, "\n\n");
      const createdAt = faker.date.past({ years: 1 });

      const poemRes = await pool.query(
        "INSERT INTO poems (title, content, user_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id",
        [title, content, randomAuthorId, createdAt]
      );
      const poemId = poemRes.rows[0].id;
      poemIds.push(poemId);

      // Randomly assign 1 to 3 distinct themes to this poem
      const numThemes = faker.number.int({ min: 1, max: 3 });
      const chosenThemes = faker.helpers.arrayElements(themeIds, numThemes);

      for (const themeId of chosenThemes) {
        await pool.query(
          "INSERT INTO poem_themes (poem_id, theme_id) VALUES ($1, $2)",
          [poemId, themeId]
        );
      }
    }

    // Seed likes
    console.log("Seeding likes...");
    for (const poemId of poemIds) {
      const numLikes = faker.number.int({ min: 0, max: MAX_LIKES_PER_POEM });
      const likers = faker.helpers.arrayElements(userIds, Math.min(numLikes, userIds.length));

      for (const userId of likers) {
        // Spread likes across the last 14 days, so "popular" timeframe filters have something to show
        const likedAt = faker.date.recent({ days: 14 });

        await pool.query(
          "INSERT INTO likes (user_id, poem_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
          [userId, poemId, likedAt]
        );
      }
    }

    // Seed comments
    console.log("Seeding comments...");
    for (const poemId of poemIds) {
      const numComments = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POEM });

      for (let i = 0; i < numComments; i++) {
        const userId = faker.helpers.arrayElement(userIds);
        const content = faker.lorem.sentence();

        await pool.query(
          "INSERT INTO comments (content, user_id, poem_id) VALUES ($1, $2, $3)",
          [content, userId, poemId]
        );
      }
    }

    // Seed saved poems
    console.log("Seeding saved...");
    for (const userId of userIds) {
      const numSaves = faker.number.int({ min: 0, max: MAX_SAVED_POEMS_PER_USER });
      const savedPoems = faker.helpers.arrayElements(poemIds, Math.min(numSaves, poemIds.length));

      for (const poemId of savedPoems) {
        await pool.query(
          "INSERT INTO saved_poems (user_id, poem_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [userId, poemId]
        );
      }
    }

    console.log("✅ Seeding complete!");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await pool.end();
    process.exit();
  }
}

seedDatabase();