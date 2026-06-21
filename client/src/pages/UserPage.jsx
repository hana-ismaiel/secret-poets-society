import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { usePoems } from "@/hooks/usePoems"
import { useUsers } from "@/hooks/useUsers"

function UserPage() {
  const { id } = useParams()
  const { getUserPoems } = usePoems()
  const { getUserById } = useUsers()
  const [user, setUser] = useState(null)
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUserAndPoems() {
      try {
        const [userData, poemsData] = await Promise.all([
          getUserById(id),
          getUserPoems(id),
        ])
        setUser(userData)
        setPoems(poemsData)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndPoems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading user...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
      <div className="flex-1 flex flex-col gap-8">
        {poems.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            No poems published yet
          </p>
        ) : (
          poems.map((poem) => <PoemCard key={poem.id} poem={poem} />)
        )}
      </div>

      <div className="w-64">
        <Card>
          <CardContent className="flex flex-col items-center text-center pt-6">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarFallback className="text-xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-lg font-semibold">{user.username}</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Joined {joinedDate}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              {poems.length} {poems.length === 1 ? "poem" : "poems"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserPage