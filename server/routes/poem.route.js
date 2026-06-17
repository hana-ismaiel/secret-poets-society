const express = require("express");
const router = express.Router();
const { createPoem, deletePoem, getAllPoems, getPoemById } = require("../controllers/poem.controller");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, createPoem);
router.delete("/:id", authenticateToken, deletePoem);
router.get("/", getAllPoems);
router.get("/:id", getPoemById);

module.exports = router;