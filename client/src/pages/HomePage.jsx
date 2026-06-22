import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import { usePoems } from "@/hooks/usePoems"

function HomePage() {
  const { getAllPoems } = usePoems()
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoems() {
      try {
        const data = await getAllPoems()
        setPoems(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <p className="text-center mt-10">Loading poems...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      {poems.map((poem) => (
        <PoemCard key={poem.id} poem={poem} />
      ))}
    </div>
  )
}

export default HomePage