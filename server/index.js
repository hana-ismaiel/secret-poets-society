const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user.route");
const poemRoutes = require("./routes/poem.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/poems", poemRoutes);

app.get("/", (req, res) => {
  res.send("✅");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});