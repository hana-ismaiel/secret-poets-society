import { Feather, Bookmark, Heart, Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

function ProfileTabs({ activeTab, onTabChange, isOwnProfile }) {
  const tabs = [
    { key: "poems", label: isOwnProfile ? "My Poems" : "Poems", icon: Feather },
    ...(isOwnProfile ? [
      { key: "saved", label: "Saved", icon: Bookmark },
      { key: "liked", label: "Liked", icon: Heart },
    ] : []),
    { key: "followers", label: "Followers", icon: Users },
    { key: "following", label: "Following", icon: UserPlus },
  ]

  return (
    <div className="font-text flex flex-col gap-1">
      {tabs.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant={activeTab === key ? "default" : "ghost"}
          className="justify-start rounded-none font-medium h-10 w-full gap-2"
          onClick={() => onTabChange(key)}
        >
          <Icon size={16} />
          {label}
        </Button>
      ))}
    </div>
  )
}

export default ProfileTabs