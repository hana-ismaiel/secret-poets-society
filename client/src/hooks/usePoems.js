import api from "@/lib/api"


export function usePoems() {

  const POEMS_PER_PAGE = 20
  
  async function getAllPoems(page = 1, limit = POEMS_PER_PAGE) {
    const response = await api.get(`/poems?page=${page}&limit=${limit}`)
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

  async function getPoemsByCategory(categoryId) {
    const response = await api.get(`/poems/category/${categoryId}`)
    return response.data
  }

  async function getPopularPoems(timeframe = "all") {
    const response = await api.get(`/poems/popular?timeframe=${timeframe}`);
    return response.data;
  }

  return {
    POEMS_PER_PAGE,
    getAllPoems,
    getPoemById,
    getUserPoems,
    createPoem,
    editPoem,
    deletePoem,
    getPoemsByCategory,
    getPopularPoems
  }
}