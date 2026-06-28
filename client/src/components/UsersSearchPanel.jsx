import { useState, useEffect } from "react"
import UserListItem from "@/components/UserListItem"
import Pagination from "@/components/Pagination"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useUsers } from "@/hooks/useUsers"

function UsersSearchPanel({ query }) {
  const { searchUsers } = useUsers()

  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const data = await searchUsers(query, currentPage)
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
  }, [query, currentPage])

  if (loading) return <LoadingSpinner />
  if (error) return <p className="font-text text-center text-red-500 mt-10">{error}</p>
  if (users.length === 0) return <p className="font-text text-center text-muted-foreground mt-10">No users found.</p>

  return (
    <div className="flex flex-col">
      {users.map((u) => <UserListItem key={u.id} user={u} />)}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default UsersSearchPanel