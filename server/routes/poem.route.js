const express = require("express");
const router = express.Router();
const {
  createPoem,
  deletePoem,
  editPoem,
  getAllPoems,
  getPoemById,
  getUserPoems,
  getPoemsByCategory
} = require("../controllers/poem.controller");
const auth = require("../middleware/auth");

router.post("/", auth, createPoem);
router.delete("/:id", auth, deletePoem);
router.put("/:id", auth, editPoem)
router.get("/", getAllPoems);
router.get("/:id", getPoemById);
router.get("/user/:userId", getUserPoems);
router.get("/category/:categoryId", getPoemsByCategory);


module.exports = router;