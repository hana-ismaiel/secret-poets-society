import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePoems } from "@/hooks/usePoems"
import { useThemes } from "@/hooks/useThemes"
import LoadingSpinner from "@/components/LoadingSpinner"

const MAX_THEMES = 3

function CreatePoemPage() {
  const navigate = useNavigate()
  const { createPoem } = usePoems()
  const { themes, loading: themesLoading } = useThemes()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedThemeIds, setSelectedThemeIds] = useState([])
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function toggleTheme(themeId) {
    setSelectedThemeIds((prev) => {
      if (prev.includes(themeId)) {
        return prev.filter((id) => id !== themeId)
      }
      if (prev.length >= MAX_THEMES) {
        return prev
      }
      return [...prev, themeId]
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setSubmitting(true)
    try {
      const newPoem = await createPoem({
        title,
        content,
        themeIds: selectedThemeIds,
      })
      navigate(`/poems/${newPoem.id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Write a Poem</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Write your poem here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
        />

        <div>
          <p className="text-sm font-medium mb-2">
            Themes (up to {MAX_THEMES})
          </p>

          {themesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => {
                const isSelected = selectedThemeIds.includes(theme.id)

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => toggleTheme(theme.id)}
                    className={`text-xs px-3 py-1 rounded-full border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {theme.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Publishing..." : "Publish Poem"}
        </Button>
      </form>
    </div>
  )
}

export default CreatePoemPage