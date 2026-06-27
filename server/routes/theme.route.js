const express = require("express");
const router = express.Router();
const { getThemes, getThemeByPathname } = require("../controllers/theme.controller");

router.get("/", getThemes);
router.get("/pathname/:pathname", getThemeByPathname);

module.exports = router;