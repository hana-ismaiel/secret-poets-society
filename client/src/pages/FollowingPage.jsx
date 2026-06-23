import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PoemCard from "@/components/PoemCard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useFollows } from "@/hooks/useFollows"

function FollowingPage() {
  const { user } = useAuth()
  const { getFollowingFeed } = useFollows()
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      return
    }

    async function fetchFeed() {
      try {
        const data = await getFollowingFeed()
        setPoems(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Sign in to see poems from people you follow
        </p>
        <Link to="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  if (loading) return <p className="text-center mt-10">Loading poems...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Following</h1>

      {poems.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No poems yet from people you follow. Try following some poets!
        </p>
      ) : (
        poems.map((poem) => <PoemCard key={poem.id} poem={poem} />)
      )}
    </div>
  )
}

export default FollowingPage