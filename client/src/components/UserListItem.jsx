import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarColorClass } from "@/lib/avatarColors"

function UserListItem({ user }) {
  return (
    <Link
      to={`/users/${user.id}`}
      className="flex items-center gap-3 py-3 border-b hover:bg-muted px-2 rounded-md"
    >
      <Avatar className={`w-10 h-10 ${getAvatarColorClass(user.avatar_color)}`}>
        <AvatarFallback className={`text-white ${getAvatarColorClass(user.avatar_color)}`}>
          {user.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <span className="font-text font-medium">{user.username}</span>
    </Link>
  )
}

export default UserListItem