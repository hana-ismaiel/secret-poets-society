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