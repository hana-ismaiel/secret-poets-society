import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import Pagination from "@/components/Pagination"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useCategories } from "@/hooks/useCategories"
import { usePoems } from "@/hooks/usePoems"

function ThemesPage() {
  const { categories, loading: categoriesLoading } = useCategories()
  const { getPoemsByCategory } = usePoems()

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [poems, setPoems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [poemsLoading, setPoemsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedCategory) return
    async function fetchThemePoems() {
      setPoemsLoading(true)
      setError(null)
      try {
        const data = await getPoemsByCategory(selectedCategory.id, currentPage)
        setPoems(data.poems)
          setTotalPages(data.pagination.totalPages)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
          setPoems([])
      } finally {
        setPoemsLoading(false)
      }
    }
    fetchThemePoems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, currentPage])

  const handlePoemDeleted = (deletedPoemId) => {
    setPoems((prevPoems) => prevPoems.filter(poem => poem.id !== deletedPoemId))
  }

  function handleSelectCategory(category) {
    setPoems([])
    setCurrentPage(1) // Reset back to page 1
    setTotalPages(1) // Clear page count
    setSelectedCategory(category)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Explore Themes</h1>

      {categoriesLoading ? (
        <LoadingSpinner />
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
            <LoadingSpinner />
          ) : error ? (
            <p className="text-center text-red-500 mt-6">{error}</p>
          ) : poems.length === 0 ? (
            <p className="text-center text-muted-foreground mt-6">
              No poems found in this theme yet
            </p>
          ) : (
            poems.map((poem) => <PoemCard key={poem.id} poem={poem} onDeleteSuccess={handlePoemDeleted} />)
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

export default ThemesPage