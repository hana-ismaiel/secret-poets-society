import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import UserBio from "./UserBio"
import AvatarColorPicker from "./AvatarColorPicker"
import { getAvatarColorClass } from "@/lib/avatarColors"

function UserProfileCard({ user, isOwnProfile, onBioUpdated, onAvatarUpdated }) {
  const [editingAvatar, setEditingAvatar] = useState(false)

  if (!user) return null

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  function handleColorUpdated(updatedUser) {
    onAvatarUpdated(updatedUser)
    setEditingAvatar(false)
  }

  const avatarRender = (
    <Avatar className={`w-20 h-20 mb-4 transition-transform group-hover:scale-105 ${getAvatarColorClass(user.avatar_color)}`}>
      <AvatarFallback className={`text-xl text-white ${getAvatarColorClass(user.avatar_color)}`}>
        {user.username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <Card className="rounded-none">
      <CardContent className="flex flex-col items-center text-center pt-6">
        {editingAvatar ? (
          <AvatarColorPicker
            user={user}
            onColorUpdated={handleColorUpdated}
            onCancel={() => setEditingAvatar(false)}
          />
        ) : (
          <div className="w-full flex justify-center">
            {isOwnProfile ? (
              <button
                onClick={() => setEditingAvatar(true)}
                className="group relative focus:outline-none cursor-pointer rounded-full"
              >
                {avatarRender}
              </button>
            ) : (
              <div>
                {avatarRender}
              </div>
            )}
          </div>
        )}

        <h2 className="font-text text-lg font-semibold">{user.username}</h2>
        <p className="font-text text-sm text-muted-foreground mt-1 mb-4">Joined {joinedDate}</p>

        <div className="font-text w-full border-t pt-4 text-left flex">
          <UserBio 
            user={user} 
            isOwnProfile={isOwnProfile} 
            onBioUpdated={onBioUpdated} 
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileCard