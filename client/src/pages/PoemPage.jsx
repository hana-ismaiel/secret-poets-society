import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Poem from "@/components/Poem"
import CommentSection from "@/components/CommentSection"
import { usePoems } from "@/hooks/usePoems"

function PoemPage() {
  const { id } = useParams()
  const { getPoemById } = usePoems()
  const [poem, setPoem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoem() {
      try {
        const data = await getPoemById(id)
        setPoem(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPoem()
  }, [id, getPoemById])

  if (loading) return <p className="text-center mt-10">Loading poem...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div>
      <Poem poem={poem} />
      <CommentSection poemId={poem.id}/>
    </div>
  )
}

export default PoemPage