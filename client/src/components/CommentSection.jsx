import { useState, useEffect } from "react"
import { useComments } from "@/hooks/useComments"
import CommentForm from "@/components/CommentForm"
import Comment from "@/components/Comment"
import LoadingSpinner from "./LoadingSpinner"

function CommentSection({ poemId }) {
  const { getCommentsForPoem } = useComments()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await getCommentsForPoem(poemId)
        setComments(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemId])

  function handleCommentCreated(newComment) {
    setComments((prev) => [...prev, newComment])
  }

  function handleReplyCreated(parentId, newReply) {
    setComments((prev) => addReply(prev, parentId, newReply))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 mt-10">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      <CommentForm poemId={poemId} onCommentCreated={handleCommentCreated} />

      {loading && <LoadingSpinner />}
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}

      {!loading && !error && (
        comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No comments yet</p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                poemId={poemId}
                onReplyCreated={handleReplyCreated}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}

function addReply(comments, parentId, newReply) {
  return comments.map((comment) => {
    if (comment.id === parentId) { // Found the parent comment - add the new reply to its replies array
      return { ...comment, replies: [...(comment.replies || []), newReply] }
    }
    if (comment.replies && comment.replies.length > 0) { // Repeat for the replies of current comment
      return { ...comment, replies: addReply(comment.replies, parentId, newReply) }
    }
    return comment
  })
}

export default CommentSection