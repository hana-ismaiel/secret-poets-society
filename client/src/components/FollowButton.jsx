import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useFollows } from "@/hooks/useFollows"

function FollowButton({ userId }) {
  const { toggleFollow, checkIsFollowing } = useFollows()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const data = await checkIsFollowing(userId)
        setIsFollowing(data.following)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  async function handleClick() {
    try {
      const data = await toggleFollow(userId)
      setIsFollowing(data.following)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return null

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className="font-text w-full"
      onClick={handleClick}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}

export default FollowButton