import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useComments } from "@/hooks/useComments"
import { useAuth } from "@/hooks/useAuth"

function CommentForm({ poemId, onCommentCreated }) {
  const { user } = useAuth()
  const { createComment } = useComments()
  const [content, setContent] = useState("")
  const [isWriting, setIsWriting] = useState(false)

  async function handleSubmit() {
    if (!content.trim()) return

    const newComment = await createComment(poemId, content, null)
    onCommentCreated({ ...newComment, username: user.username, replies: [] })
    setContent("")
    setIsWriting(false)
  }

  function handleCancel() {
    setContent("")
    setIsWriting(false)
  }

  return (
    <div className="font-text mb-6">
      <Textarea
        placeholder={user ? "What are your thoughts?" : "Log in to share your thoughts..."}
        value={content}
        onFocus={() => user && setIsWriting(true)}
        onChange={(e) => setContent(e.target.value)}
        disabled={!user}
        className={!user ? "bg-muted/50 cursor-not-allowed" : ""}
      />

      {user && isWriting && (
        <div className="font-text flex gap-2 mt-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Comment
          </Button>
        </div>
      )}

      {!user && (
        <p className="text-xs text-muted-foreground mt-2">
          Want to join the conversation?{" "}
          <Link to="/login" className="text-primary underline font-medium hover:text-lime-600">
            Sign in to comment
          </Link>
        </p>
      )}
    </div>
  )
}

export default CommentForm