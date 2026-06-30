import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import PoemCard from "@/components/PoemCard"
import Pagination from "@/components/Pagination"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useThemes } from "@/hooks/useThemes"
import { usePoems } from "@/hooks/usePoems"
import NotFoundPage from "./NotFoundPage"

function ThemeDetailPage() {
  const { pathname } = useParams()
  const { getThemeByPathname } = useThemes()
  const { getPoemsByTheme } = usePoems()

  const [theme, setTheme] = useState(null)
  const [themeLoading, setThemeLoading] = useState(true)
  const [themeError, setThemeError] = useState(null)

  const [poems, setPoems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [poemsLoading, setPoemsLoading] = useState(true)
  const [poemsError, setPoemsError] = useState(null)

  // Determine the theme using the pathname in the url
  useEffect(() => {
    async function fetchTheme() {
      setThemeLoading(true)
      setCurrentPage(1)
      try {
        const data = await getThemeByPathname(pathname)
        setTheme(data)
      } catch (err) {
        setThemeError(err.response?.data?.message || "Theme not found")
      } finally {
        setThemeLoading(false)
      }
    }
    fetchTheme()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Fetch poems of the theme
  useEffect(() => {
    if (!theme) return
    async function fetchThemePoems() {
      setPoemsLoading(true)
      try {
        const data = await getPoemsByTheme(theme.id, currentPage)
        setPoems(data.poems)
        setTotalPages(data.pagination.totalPages)
      } catch (err) {
        setPoemsError(err.response?.data?.message || "Something went wrong")
      } finally {
        setPoemsLoading(false)
      }
    }
    fetchThemePoems()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, currentPage])

  function handlePoemDeleted(deletedPoemId) {
    setPoems((prev) => prev.filter((poem) => poem.id !== deletedPoemId))
  }

  if (themeLoading) return <LoadingSpinner />
  if (!theme) return <NotFoundPage />
  if (themeError) return <p className="text-center text-red-500 mt-10">{themeError}</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-text text-2xl font-bold mb-8">Explore Themes</h1>

      <div className="flex flex-col gap-8">
        <h2 className="font-text text-xl font-semibold border-b pb-2">{theme.name}</h2>

        {poemsLoading ? (
          <LoadingSpinner />
        ) : poemsError ? (
          <p className="font-text text-center text-red-500 mt-6">{poemsError}</p>
        ) : poems.length === 0 ? (
          <p className="font-text text-center text-muted-foreground mt-6">
            No poems created in this theme yet
          </p>
        ) : (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
            {poems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                poem={poem} 
                onDeleteSuccess={handlePoemDeleted} 
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default ThemeDetailPage