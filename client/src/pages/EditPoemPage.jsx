import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePoems } from "@/hooks/usePoems"
import { useThemes } from "@/hooks/useThemes"
import LoadingSpinner from "@/components/LoadingSpinner"

const MAX_THEMES = 3

function EditPoemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editPoem, getPoemById } = usePoems() 
  const { themes, loading: themesLoading } = useThemes()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedThemeIds, setSelectedThemeIds] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Fetch the current state of the poem to fill the form values
  useEffect(() => {
    async function loadPoem() {
      try {
        const poem = await getPoemById(id)
        setTitle(poem.title)
        setContent(poem.content)
        if (poem.themes) {
          setSelectedThemeIds(poem.themes.map((c) => c.id))
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setInitialLoading(false)
      }
    }
    loadPoem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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
      await editPoem(id, {
        title,
        content,
        themeIds: selectedThemeIds,
      })
      navigate(`/poems/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong updating the poem")
      setSubmitting(false)
    }
  }

  if (initialLoading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Edit Your Poem</h1>

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

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving Changes..." : "Save Changes"}
          </Button>
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditPoemPage