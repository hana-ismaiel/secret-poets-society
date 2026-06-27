import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { useComments } from "@/hooks/useComments"

const MAX_DEPTH = 4

function Comment({ comment, poemId, onReplyCreated, depth = 0 }) {
  const { user } = useAuth()
  const { createComment } = useComments()

  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  async function handleReplySubmit() {
    if (!replyContent.trim()) return

    const newReply = await createComment(poemId, replyContent, comment.id)
    onReplyCreated(comment.id, { ...newReply, username: user.username, replies: [] })
    setReplyContent("")
    setShowReplyForm(false)
  }

  function handleCancel() {
    setReplyContent("")
    setShowReplyForm(false)
  }

  // Cap how far right things can shift, no matter how deep the actual reply chain goes
  const visualDepth = Math.min(depth, MAX_DEPTH)
  const indentClass = depth === 0 ? "" : `ml-${visualDepth * 4} border-l pl-4`

  return (
    <div className={indentClass}>
      <p className="font-text font-bold text-sm">
        <Link to={`/users/${comment.user_id}`} className="hover:underline">
          {comment.username}
        </Link>
      </p>

      <p className="font-text">{comment.content}</p>

      {user && (
        <button
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="font-text text-xs text-muted-foreground hover:underline mt-1"
        >
          Reply
        </button>
      )}

      {showReplyForm && (
        <div className="font-text mt-2 max-w-md">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="font-text flex gap-2 mt-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleReplySubmit}>
              Reply
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              poemId={poemId}
              onReplyCreated={onReplyCreated}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment