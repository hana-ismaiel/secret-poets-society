import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePoems } from "@/hooks/usePoems"
import { useCategories } from "@/hooks/useCategories"

const MAX_CATEGORIES = 3

function EditPoemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editPoem, getPoemById } = usePoems() 
  const { categories, loading: categoriesLoading } = useCategories()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
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
        if (poem.categories) {
          setSelectedCategoryIds(poem.categories.map((c) => c.id))
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

  function toggleCategory(categoryId) {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      }
      if (prev.length >= MAX_CATEGORIES) {
        return prev
      }
      return [...prev, categoryId]
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
        categoryIds: selectedCategoryIds,
      })
      navigate(`/poems/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong updating the poem")
      setSubmitting(false)
    }
  }

  if (initialLoading) return <p className="text-center mt-10">Loading poem details...</p>

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
            Categories (up to {MAX_CATEGORIES})
          </p>

          {categoriesLoading ? (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id)

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`text-xs px-3 py-1 rounded-full border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {category.name}
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