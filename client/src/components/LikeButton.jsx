import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { useLikes } from "@/hooks/useLikes"
import { useAuth } from "@/hooks/useAuth"

function LikeButton({ poemId }) {
  const { toggleLike, getLikeCount, checkUserLiked } = useLikes()
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLikeInfo() {
      try {
        const likeCount = await getLikeCount(poemId)
        setCount(likeCount.count)

        if (user) {
          const userLiked = await checkUserLiked(poemId)
          setLiked(userLiked.liked)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLikeInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemId])

  async function handleClick() {
    if (!user) return

    try {
      const data = await toggleLike(poemId)
      setLiked(data.liked)
      setCount((prev) => (data.liked ? prev + 1 : prev - 1))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return null

  return (
    <button
      onClick={handleClick}
      disabled={!user}
      className="flex items-center gap-1 disabled:cursor-not-allowed"
    >
      <Heart
        className={liked ? "fill-red-500 text-red-500" : "text-white stroke-black"}
        size={20}
      />
      <span className="text-sm">{count}</span>
    </button>
  )
}

export default LikeButton