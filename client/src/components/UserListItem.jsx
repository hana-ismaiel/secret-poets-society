import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function UserListItem({ user }) {
  return (
    <Link
      to={`/users/${user.id}`}
      className="flex items-center gap-3 py-3 border-b hover:bg-muted px-2 rounded-md"
    >
      <Avatar className="w-10 h-10">
        <AvatarFallback>
          {user.username.charAt(0).toUpperCase()}
          
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">{user.username}</span>
    </Link>
  )
}

export default UserListItem