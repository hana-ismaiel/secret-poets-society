const express = require("express");
const router = express.Router();
const { register, login, getUserById, searchUsers, updateBio } = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/search", searchUsers);
router.put("/bio", auth, updateBio);
router.get("/:id", getUserById);

module.exports = router;