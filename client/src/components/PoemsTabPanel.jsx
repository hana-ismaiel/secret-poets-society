import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import { usePoems } from "@/hooks/usePoems"
import { useSaves } from "@/hooks/useSaves"
import { useLikes } from "@/hooks/useLikes"

function PoemsTabPanel({ userId, mode }) {
  // mode is "poems" | "saved" | "liked"
  const { getUserPoems } = usePoems()
  const { getUserSaves } = useSaves()
  const { getUserLikes } = useLikes()

  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoems() {
      setLoading(true)
      try {
        let data = []
        if (mode === "poems") data = await getUserPoems(userId)
        if (mode === "saved") data = await getUserSaves()
        if (mode === "liked") data = await getUserLikes()

        setPoems(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, mode])

  if (loading) return <p className="text-center text-muted-foreground mt-10">Loading...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>
  if (poems.length === 0) return <p className="text-center text-muted-foreground mt-10">No poems found.</p>

  return (
    <div className="flex flex-col gap-8">
      {poems.map((poem) => <PoemCard key={poem.id} poem={poem} />)}
    </div>
  )
}

export default PoemsTabPanel