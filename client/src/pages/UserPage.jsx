import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import UserProfileCard from "@/components/UserProfileCard"
import FollowButton from "@/components/FollowButton"
import UserListItem from "@/components/UserListItem"
import ProfileTabs from "@/components/ProfileTabs"
import { useAuth } from "@/hooks/useAuth"
import { usePoems } from "@/hooks/usePoems"
import { useUsers } from "@/hooks/useUsers"
import { useSaves } from "@/hooks/useSaves"
import { useLikes } from "@/hooks/useLikes"
import { useFollows } from "@/hooks/useFollows"

function UserPage() {
  const { id } = useParams() 
  const { user: currentUser } = useAuth() // Current logged in user
  
  const { getUserById } = useUsers()
  const { getUserPoems } = usePoems()
  const { getUserSaves } = useSaves()
  const { getUserLikes } = useLikes()
  const { getFollowers, getFollowing } = useFollows()

  const [profileUser, setProfileUser] = useState(null) // User of profile you're viewing
  const [items, setItems] = useState([]) // poems OR users, depending on tab
  const [activeTab, setActiveTab] = useState("poems")
  const [loading, setLoading] = useState(true)
  const [feedLoading, setFeedLoading] = useState(false)

  const isOwnProfile = currentUser && String(currentUser.id) === String(id)
  const isUserListTab = activeTab === "followers" || activeTab === "following"

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        const userData = await getUserById(id)
        setProfileUser(userData)
        setActiveTab("poems") 
      } catch (err) {
        console.error("User not found", err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!profileUser) return

    async function loadFeed() {
      setFeedLoading(true)
      try {
        let data = []
        
        if (activeTab === "poems") {
          data = await getUserPoems(id)
        } else if (activeTab === "saved" && isOwnProfile) {
          data = await getUserSaves()
        } else if (activeTab === "liked" && isOwnProfile) {
          data = await getUserLikes()
        } else if (activeTab === "followers") {
          data = await getFollowers(id)
        } else if (activeTab === "following") {
          data = await getFollowing(id)
        }
        setItems(data)
      } catch (err) {
        console.error("Error fetching feed rows:", err)
        setItems([]) 
      } finally {
        setFeedLoading(false)
      }
    }

    loadFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, id, isOwnProfile])

function handleTabChange(newTab) {
  setItems([])
  setActiveTab(newTab)
}

  if (loading) return <p className="text-center mt-10">Loading profile...</p>
  if (!profileUser) return <p className="text-center mt-10 text-red-500">User not found</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-8">
        <h2 className="text-xl font-bold border-b pb-2">
          {(() => {
            if (!isOwnProfile) return `${profileUser.username}'s Poems`
            if (activeTab === "saved") return "My Saved Poems"
            if (activeTab === "liked") return "My Liked Poems"
            if (activeTab === "followers") return "Followers"
            if (activeTab === "following") return "Following"
            return "My Poems"
          })()}
        </h2>

        {feedLoading ? (
          <p className="text-center text-muted-foreground mt-10">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            {isUserListTab ? "No users found." : "No poems found."}
          </p>
        ) : isUserListTab ? (
          <div className="flex flex-col">
            {items.map((u) => <UserListItem key={u.id} user={u} />)}
          </div>
        ) : (
          items.map((poem) => <PoemCard key={poem.id} poem={poem} />)
        )}
      </div>

      <div className="w-full md:w-64 flex flex-col gap-4">
        <UserProfileCard user={profileUser} />

        {!isOwnProfile && currentUser && (
          <FollowButton userId={profileUser.id} />
        )}

        <ProfileTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          isOwnProfile={isOwnProfile} 
        />
      </div>
    </div>
  )
}

export default UserPage