const express = require("express");
const router = express.Router();
const { generateAiPoem } = require("../controllers/ai.controller");

router.post("/generate", generateAiPoem);

module.exports = router;