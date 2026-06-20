import { useState, useEffect } from "react"
import api from "@/lib/api"

export function usePoems() {
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPoems() {
      try {
        const response = await api.get("/poems")
        setPoems(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
  }, [])

  return { poems, loading, error }
}