const express = require("express");
const router = express.Router();
const { toggleSaved, checkUserSaved } = require("../controllers/saves.controller");
const auth = require("../middleware/auth");

router.post("/toggle/:poemId", auth, toggleSaved);
router.get("/check/:poemId", auth, checkUserSaved);

module.exports = router;