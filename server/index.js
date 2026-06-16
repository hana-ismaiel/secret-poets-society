const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("✅");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});