import { useState, useEffect } from "react"
import UserListItem from "@/components/UserListItem"
import { useFollows } from "@/hooks/useFollows"
import LoadingSpinner from "./LoadingSpinner"

function UserListTabPanel({ userId, mode }) {
  // mode is "followers" | "following"
  const { getFollowers, getFollowing } = useFollows()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const data = mode === "followers"
          ? await getFollowers(userId)
          : await getFollowing(userId)

        setUsers(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, mode])

  if (loading) return <LoadingSpinner />
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>
  if (users.length === 0) return <p className="text-center text-muted-foreground mt-10">No users found.</p>

  return (
    <div className="flex flex-col">
      {users.map((user) => <UserListItem key={user.id} user={user} />)}
    </div>
  )
}

export default UserListTabPanel