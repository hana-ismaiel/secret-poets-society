import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

function UserProfileCard({ user }) {
  if (!user) return null

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <Card className="rounded-none">
      <CardContent className="flex flex-col items-center text-center pt-6">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarFallback className="text-xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-lg font-semibold">{user.username}</h2>
        <p className="text-sm text-muted-foreground mt-1">Joined {joinedDate}</p>
      </CardContent>
    </Card>
  )
}

export default UserProfileCard