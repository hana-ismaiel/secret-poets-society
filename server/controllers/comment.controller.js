const pool = require("../db");

const createComment = async (req, res) => {
  const { poemId } = req.params;
  const { content, parentId } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    const poem = await pool.query(
      "SELECT id FROM poems WHERE id = $1",
      [poemId]
    );

    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    if (parentId) {
      const parentComment = await pool.query(
        "SELECT id, poem_id FROM comments WHERE id = $1",
        [parentId]
      );
      if (parentComment.rows.length === 0) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      if (parentComment.rows[0].poem_id !== poemId) {
        return res.status(400).json({ message: "Parent comment does not belong to this poem" });
      }
    }

    const newComment = await pool.query(
      `INSERT INTO comments (content, user_id, poem_id, parent_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, content, user_id, poem_id, parent_id, created_at`,
      [content, userId, poemId, parentId || null]
    );

    res.status(201).json(newComment.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );
    if (comment.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    // "Soft delete" - keep in database, but mark as deleted (any replies to the comment remain intact)
    const deletedComment = await pool.query(
      `UPDATE comments 
       SET content = '[comment deleted by user]', is_deleted = true, modified_at = NOW() 
       WHERE id = $1 
       RETURNING id, content, is_deleted, user_id, poem_id, parent_id, created_at`,
      [commentId]
    );

    res.status(200).json(deletedComment.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    const comment = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );
    if (comment.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }
    if (comment.rows[0].is_deleted) {
      return res.status(400).json({ message: "Cannot edit a deleted comment" });
    }

    const editedComment = await pool.query(
      `UPDATE comments SET content = $1, modified_at = NOW() WHERE id = $2
      RETURNING id, content, is_deleted, user_id, poem_id, parent_id, created_at, modified_at`,
      [content, commentId]
    );

    res.status(201).json(editedPoem.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPoemComments = async (req, res) => {
  const { poemId } = req.params;

  try {
    const poem = await pool.query(
      "SELECT * FROM poems WHERE id = $1",
      [poemId]
    );
    if (poem.rows.length === 0) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const allComments = await pool.query(
      `SELECT 
        comments.id,
        comments.content,
        comments.is_deleted,
        comments.user_id,
        comments.poem_id,
        comments.parent_id,
        comments.created_at,
        comments.modified_at,
        users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.poem_id = $1
      ORDER BY comments.created_at ASC`,
      [poemId]
    );

    const commentMap = {}; // Map to store comments by id

    allComments.rows.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    const originalComments = []; // List of original comments (not replies to a parent comment)

    allComments.rows.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap[comment.parent_id];
        if (parent) {
          parent.replies.push(comment); // The comment is a reply, so push it to replies list of its parent
        }
      } else {
        originalComments.push(comment);
      }
    });

    res.status(201).json(originalComments); // Return the list of original comments only

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createComment,
  deleteComment,
  editComment,
  getPoemComments
};