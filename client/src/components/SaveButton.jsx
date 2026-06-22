import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"
import { useSaves } from "@/hooks/useSaves"
import { useAuth } from "@/hooks/useAuth"

function SaveButton({ poemId }) {
  const { toggleSaved, checkUserSaved } = useSaves()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSavedInfo() {
      try {
        if (user) {
          const userSaved = await checkUserSaved(poemId)
          setSaved(userSaved.saved)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemId])

  async function handleClick() {
    if (!user) return

    try {
      const data = await toggleSaved(poemId)
      setSaved(data.saved)
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
      <Bookmark
        className={saved ? "fill-yellow-500 text-yellow-500" : "text-white stroke-black"}
        size={20}
      />
    </button>
  )
}

export default SaveButton