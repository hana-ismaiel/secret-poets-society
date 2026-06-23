import { useState } from "react"
import PoemCard from "@/components/PoemCard"
import { useCategories } from "@/hooks/useCategories"
import { usePoems } from "@/hooks/usePoems"

function ThemesPage() {
  const { categories, loading: categoriesLoading } = useCategories()
  const { getPoemsByCategory } = usePoems()

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [poems, setPoems] = useState([])
  const [poemsLoading, setPoemsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSelectCategory(category) {
    setSelectedCategory(category)
    setPoemsLoading(true)
    setError(null)

    try {
      const data = await getPoemsByCategory(category.id)
      setPoems(data.poems)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setPoemsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Themes</h1>

      {categoriesLoading ? (
        <p className="text-muted-foreground">Loading themes...</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => {
            const isSelected = selectedCategory?.id === category.id

            return (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className={`text-sm px-4 py-1.5 rounded-full border ${
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

      {selectedCategory && (
        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-semibold border-b pb-2">
            {selectedCategory.name}
          </h2>

          {poemsLoading ? (
            <p className="text-center text-muted-foreground mt-6">Loading poems...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-6">{error}</p>
          ) : poems.length === 0 ? (
            <p className="text-center text-muted-foreground mt-6">
              No poems found in this theme yet
            </p>
          ) : (
            poems.map((poem) => <PoemCard key={poem.id} poem={poem} />)
          )}
        </div>
      )}
    </div>
  )
}

export default ThemesPage