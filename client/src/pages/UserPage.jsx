import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import UserProfileCard from "@/components/UserProfileCard"
import FollowButton from "@/components/FollowButton"
import ProfileTabs from "@/components/ProfileTabs"
import PoemsTabPanel from "@/components/PoemsTabPanel"
import UserListTabPanel from "@/components/UserListTabPanel"
import LoadingSpinner from "@/components/LoadingSpinner"
import NotFoundPage from "@/pages/NotFoundPage"
import { useAuth } from "@/hooks/useAuth"
import { useUsers } from "@/hooks/useUsers"

const VALID_TABS = ["poems", "saved", "liked", "followers", "following"]

function UserPage() {
  const { id, tab } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { getUserById } = useUsers()

  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isOwnProfile = currentUser && String(currentUser.id) === String(id)
  const isInvalidTab = tab !== undefined && !VALID_TABS.includes(tab)
  const activeTab = !isInvalidTab && tab ? tab : "poems" // Default to "poems" tab if none provided

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        const userData = await getUserById(id)
        setProfileUser(userData)
      } catch (err) {
        console.error("User not found", err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleTabChange(newTab) {
    navigate(`/users/${id}/${newTab}`)
  }

  if (loading) return <LoadingSpinner />
  if (!profileUser) return <p className="text-center mt-10 text-red-500">User not found</p>
  if (isInvalidTab || !profileUser) return <NotFoundPage />

  const tabTitles = {
    poems: isOwnProfile ? "My Poems" : `${profileUser.username}'s Poems`,
    saved: "My Saved Poems",
    liked: "My Liked Poems",
    followers: "Followers",
    following: "Following",
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-8">
        <h2 className="font-text text-xl font-bold border-b pb-2">{tabTitles[activeTab]}</h2>

        {(activeTab === "poems" || activeTab === "saved" || activeTab === "liked") && (
          <PoemsTabPanel
            key={`${id}-${activeTab}`}
            userId={id}
            mode={activeTab}
          />
        )}

        {(activeTab === "followers" || activeTab === "following") && (
          <UserListTabPanel
            key={`${id}-${activeTab}`}
            userId={id}
            mode={activeTab}
          />
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