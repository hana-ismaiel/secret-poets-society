const express = require("express");
const router = express.Router();
const {
  createPoem,
  deletePoem,
  editPoem,
  getAllPoems,
  getPoemById,
  getUserPoems,
} = require("../controllers/poem.controller");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optional-auth")

router.post("/", auth, createPoem);
router.delete("/:id", auth, deletePoem);
router.put("/:id", auth, editPoem)
router.get("/", getAllPoems);
router.get("/:id", getPoemById);
router.get("/user/:userId", optionalAuth, getUserPoems);


module.exports = router;