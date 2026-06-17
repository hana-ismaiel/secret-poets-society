const express = require("express");
const router = express.Router();
const { toggleLike, getLikeCount, checkUserLiked, getUserLikes } = require("../controllers/like.controller");
const auth = require("../middleware/auth");

router.post("/toggle/:poemId", auth, toggleLike);
router.get("/count/:poemId", getLikeCount);
router.get("/check/:poemId", auth, checkUserLiked);
router.get("/my-likes", auth, getUserLikes);


module.exports = router;