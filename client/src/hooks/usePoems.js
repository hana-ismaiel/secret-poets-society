// import { useState, useEffect } from "react"
// import api from "@/lib/api"

// export function usePoems() {
//   const [poems, setPoems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     async function fetchPoems() {
//       try {
//         const response = await api.get("/poems")
//         setPoems(response.data)
//       } catch (err) {
//         setError(err.response?.data?.message || "Something went wrong")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPoems()
//   }, [])

//   return { poems, loading, error }
// }

import api from "@/lib/api"

export function usePoems() {
  async function getAllPoems() {
    const response = await api.get("/poems")
    return response.data
  }

  async function getPoemById(id) {
    const response = await api.get(`/poems/${id}`)
    return response.data
  }

  async function getUserPoems(userId) {
    const response = await api.get(`/poems/user/${userId}`)
    return response.data
  }

  async function createPoem(poemData) {
    const response = await api.post("/poems", poemData)
    return response.data
  }

  async function editPoem(id, poemData) {
    const response = await api.put(`/poems/${id}`, poemData)
    return response.data
  }

  async function deletePoem(id) {
    const response = await api.delete(`/poems/${id}`)
    return response.data
  }

  return { getAllPoems, getPoemById, getUserPoems, createPoem, editPoem, deletePoem }
}