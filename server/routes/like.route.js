const express = require("express");
const router = express.Router();
const { toggleLike, getLikeCount, checkUserLiked } = require("../controllers/like.controller");
const auth = require("../middleware/auth");

router.post("/toggle/:poemId", auth, toggleLike);
router.get("/count/:poemId", getLikeCount);
router.get("/check/:poemId", auth, checkUserLiked);

module.exports = router;