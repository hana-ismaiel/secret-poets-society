const express = require("express");
const router = express.Router();
const { toggleSaved, checkUserSaved, getUserSaves } = require("../controllers/savedPoem.controller");
const auth = require("../middleware/auth");

router.post("/toggle/:poemId", auth, toggleSaved);
router.get("/check/:poemId", auth, checkUserSaved);
router.get("/my-saved", auth, getUserSaves);


module.exports = router;