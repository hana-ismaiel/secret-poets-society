const express = require("express");
const router = express.Router();
const {
  createPoem,
  deletePoem,
  editPoem,
  getAllPoems,
  getPoemById,
  getUserPoems,
  getPoemsByCategory,
  getPopularPoems,
  getFollowingFeed,
  getUserLikes,
  getUserSaves
} = require("../controllers/poem.controller");
const auth = require("../middleware/auth");

router.post("/", auth, createPoem);
router.get("/popular", getPopularPoems);
router.get("/", getAllPoems);
router.get("/user/:userId", getUserPoems);
router.get("/category/:categoryId", getPoemsByCategory);
router.get("/following", auth, getFollowingFeed);
router.get("/likes", auth, getUserLikes);
router.get("/saves", auth, getUserSaves);
router.get("/:id", getPoemById);
router.delete("/:id", auth, deletePoem);
router.put("/:id", auth, editPoem);


module.exports = router;