import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import Pagination from "@/components/Pagination"
import { usePoems } from "@/hooks/usePoems"
import LoadingSpinner from "./LoadingSpinner"

function PoemsTabPanel({ userId, mode }) {
  // mode is "poems" | "saved" | "liked"
  const { getUserPoems, getUserLikes, getUserSaves } = usePoems()

  const [poems, setPoems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoems() {
      setLoading(true)
      try {
        let data = []
        if (mode === "poems") {
          data = await getUserPoems(userId, currentPage)
        } else if (mode === "saved") {
          data = await getUserSaves(currentPage)
        } else { // (mode === "liked")
          data = await getUserLikes(currentPage)
        }
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
  }, [userId, mode, currentPage])

  if (loading) return <LoadingSpinner />
  if (error) return <p className="font-text text-center text-red-500 mt-10">{error}</p>
  if (poems.length === 0) return <p className="font-text text-center text-muted-foreground mt-10">No poems found.</p>

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
      {poems.map((poem) => <PoemCard key={poem.id} poem={poem} />)}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default PoemsTabPanel