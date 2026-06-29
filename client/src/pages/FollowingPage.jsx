import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PoemCard from "@/components/PoemCard"
import Pagination from "@/components/Pagination"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { usePoems } from "@/hooks/usePoems"

function FollowingPage() {
  const { user } = useAuth()
  const { getFollowingFeed } = usePoems()
  const [poems, setPoems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      return
    }

    async function fetchFeed() {
      setLoading(true)
      setError(null)
      try {
        const data = await getFollowingFeed(currentPage)
        setPoems(data.poems)
        setTotalPages(data.pagination.totalPages)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage])

  const handlePoemDeleted = (deletedPoemId) => {
    setPoems((prevPoems) => prevPoems.filter(poem => poem.id !== deletedPoemId))
  }

  if (!user) {
    return (
      <div className="font-text max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Create an account or sign in to see poems from people you follow
        </p>
        <Link to="/register">
          <Button>Create Account</Button>
        </Link>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />
  if (error) return <p className="font-text text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      <h1 className="font-text text-2xl font-bold">Following</h1>

      {poems.length === 0 ? (
        <p className="font-text font-text text-center text-muted-foreground mt-10">
          No poems yet from people you follow. Try following some poets!
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} onDeleteSuccess={handlePoemDeleted} />
          ))}

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

export default FollowingPage