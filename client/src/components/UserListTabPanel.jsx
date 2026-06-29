import { useState, useEffect } from "react"
import UserListItem from "@/components/UserListItem"
import Pagination from "@/components/Pagination"
import { useFollows } from "@/hooks/useFollows"
import LoadingSpinner from "./LoadingSpinner"

function UserListTabPanel({ userId, mode }) {
  // mode is "followers" | "following"
  const { getFollowers, getFollowing } = useFollows()

  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const data = mode === "followers"
          ? await getFollowers(userId, currentPage)
          : await getFollowing(userId, currentPage)

        setUsers(data.users)
        setTotalPages(data.pagination.totalPages)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, mode, currentPage])

  if (loading) return <LoadingSpinner />
  if (error) return <p className="font-text text-center text-red-500 mt-10">{error}</p>
  if (users.length === 0) return <p className="font-text text-center text-muted-foreground mt-10">No users found.</p>

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
      {users.map((user) => <UserListItem key={user.id} user={user} />)}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default UserListTabPanel