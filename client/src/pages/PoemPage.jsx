import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import Poem from "@/components/Poem"

function PoemPage() {
  const { id } = useParams()
  const [poem, setPoem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoem() {
      try {
        const response = await api.get(`/poems/${id}`)
        setPoem(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPoem()
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading poem...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return <Poem poem={poem} />
}

export default PoemPage