const express = require("express");
const router = express.Router();
const { createComment, deleteComment, editComment, getPoemComments } = require("../controllers/comment.controller");
const auth = require("../middleware/auth");

router.post("/:poemId", auth, createComment);
router.delete("/:commentId", auth, deleteComment);
router.put("/:commentId", auth, editComment);
router.get("/:poemId", getPoemComments);


module.exports = router;