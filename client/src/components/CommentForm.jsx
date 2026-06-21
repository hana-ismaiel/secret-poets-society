import { useState } from "react"
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
    <div className="mb-6">
      <Textarea
        placeholder="What are your thoughts?"
        value={content}
        onFocus={() => setIsWriting(true)}
        onChange={(e) => setContent(e.target.value)}
      />

      {isWriting && (
        <div className="flex gap-2 mt-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Comment
          </Button>
        </div>
      )}
    </div>
  )
}

export default CommentForm