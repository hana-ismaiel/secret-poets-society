import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePoems } from "@/hooks/usePoems"
import { useCategories } from "@/hooks/useCategories"

const MAX_CATEGORIES = 3

function CreatePoemPage() {
  const navigate = useNavigate()
  const { createPoem } = usePoems()
  const { categories, loading: categoriesLoading } = useCategories()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

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
      const newPoem = await createPoem({
        title,
        content,
        categoryIds: selectedCategoryIds,
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

        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Publishing..." : "Publish Poem"}
        </Button>
      </form>
    </div>
  )
}

export default CreatePoemPage