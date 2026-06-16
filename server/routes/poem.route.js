const express = require("express");
const router = express.Router();
const { createPoem, deletePoem } = require("../controllers/poem.controller");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, createPoem);
router.delete("/:id", authenticateToken, deletePoem);

module.exports = router;