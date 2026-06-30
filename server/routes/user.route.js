const express = require("express");
const router = express.Router();
const { register, login, getUserById, searchUsers, updateBio, updateAvatarColor, getUserByUsername } = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/search", searchUsers);
router.put("/bio", auth, updateBio);
router.put("/avatar-color", auth, updateAvatarColor);
router.get("/id/:id", getUserById);
router.get("/username/:username", getUserByUsername);

module.exports = router;