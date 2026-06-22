const express = require("express");
const router = express.Router();
const {
  toggleFollow,
  checkIsFollowing,
  getFollowerCount,
  getFollowingCount,
  getFollowingFeed,
} = require("../controllers/follow.controller");
const auth = require("../middleware/auth");

router.post("/toggle/:userId", auth, toggleFollow);
router.get("/check/:userId", auth, checkIsFollowing);
router.get("/followers/count/:userId", getFollowerCount);
router.get("/following/count/:userId", getFollowingCount);
router.get("/feed", auth, getFollowingFeed);

module.exports = router;