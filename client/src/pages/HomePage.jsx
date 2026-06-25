import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import { usePoems } from "@/hooks/usePoems"
import Pagination from "@/components/Pagination"

function HomePage() {
  const { getAllPoems, POEMS_PER_PAGE } = usePoems()
  const [poems, setPoems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoems() {
      setLoading(true)
      try {
        const data = await getAllPoems(currentPage, POEMS_PER_PAGE)
        setPoems(data.poems)
        setTotalPages(data.pagination.totalPages)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  if (loading) return <p className="text-center mt-10">Loading poems...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      {poems.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No poems found.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} />
          ))}
        </div>
      )}

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  )
}

export default HomePage