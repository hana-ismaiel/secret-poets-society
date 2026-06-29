import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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

  const location = useLocation()
  const prefill = location.state || {}

  const [title, setTitle] = useState(prefill.prefillTitle || "")
  const [content, setContent] = useState(prefill.prefillContent || "")
  const [selectedThemeIds, setSelectedThemeIds] = useState([])
  const isAiGenerated = prefill.isAiGenerated || false
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
        isAiGenerated,
      })
      navigate(`/poems/${newPoem.id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-text text-2xl font-bold mb-6">Write a Poem</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-text"
        />

        <Textarea
          placeholder="Write your poem here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="font-text"
        />

        <div>
          <p className="font-text text-sm font-medium mb-2">
            Themes (optional, up to {MAX_THEMES})
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
                        ? "bg-lime-600 text-white border-lime-600"
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

        {error && <p className="font-text text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={submitting} className="font-text w-fit">
          {submitting ? "Publishing..." : "Publish Poem"}
        </Button>
      </form>
    </div>
  )
}

export default CreatePoemPage