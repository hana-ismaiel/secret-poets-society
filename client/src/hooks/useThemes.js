import { useState, useEffect } from "react"
import api from "@/lib/api"

export function useThemes() {
  const [themes, setThemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await api.get("/themes")
        setThemes(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchThemes()
  }, [])

  async function getThemeByPathname(pathname) {
    const response = await api.get(`/themes/pathname/${pathname}`)
    return response.data
  }

  return { themes, loading, error, getThemeByPathname }
}