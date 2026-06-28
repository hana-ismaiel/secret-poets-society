const express = require("express");
const router = express.Router();
const { register, login, getUserById, searchUsers } = require("../controllers/user.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/search", searchUsers);
router.get("/:id", getUserById);

module.exports = router;