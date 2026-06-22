import { useState, useEffect } from "react"
import api from "@/lib/api"

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categories")
        setCategories(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}