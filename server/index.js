const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user.route");
const poemRoutes = require("./routes/poem.route");
const likeRoutes = require("./routes/like.route");
const commentRoutes = require("./routes/comment.route");
const themeRoutes = require("./routes/theme.route");
const saveRoutes = require("./routes/saves.route");
const followRoutes = require("./routes/follow.route");
const aiRoutes = require("./routes/ai.route.js")

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // local development
  'https://secret-poets-society.vercel.app', // deployed app
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json());

app.use("/users", userRoutes);
app.use("/poems", poemRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/themes", themeRoutes);
app.use("/saved", saveRoutes);
app.use("/follows", followRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("✅");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});