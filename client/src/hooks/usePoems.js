import api from "@/lib/api"


export function usePoems() {
  
  async function getAllPoems(page = 1, limit) {
    const url = limit ? `/poems?page=${page}&limit=${limit}` : `/poems?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  async function getPoemById(id) {
    const response = await api.get(`/poems/${id}`)
    return response.data
  }

  async function getUserPoems(userId, page = 1, limit) {
    const url = limit 
      ? `/poems/user/${userId}?page=${page}&limit=${limit}` 
      : `/poems/user/${userId}?page=${page}`;
      
    const response = await api.get(url)
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

  async function getPoemsByTheme(themeId, page = 1, limit) {
    const url = limit 
      ? `/poems/theme/${themeId}?page=${page}&limit=${limit}` 
      : `/poems/theme/${themeId}?page=${page}`;
      
    const response = await api.get(url)
    return response.data
  }

  async function getPopularPoems(timeframe = "all", page = 1, limit) {
    const url = limit 
      ? `/poems/popular/?timeframe=${timeframe}&page=${page}&limit=${limit}` 
      : `/poems/popular/?timeframe=${timeframe}&page=${page}` ;
      
    const response = await api.get(url)
    return response.data
  }

  async function getFollowingFeed(page = 1, limit) {
    const url = limit ? `/poems/following?page=${page}&limit=${limit}` : `/poems/following?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  async function getUserLikes(page = 1, limit) {
    const url = limit ? `/poems/likes?page=${page}&limit=${limit}` : `/poems/likes?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  async function getUserSaves(page = 1, limit) {
    const url = limit ? `/poems/saves?page=${page}&limit=${limit}` : `/poems/saves?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  return {
    getAllPoems,
    getPoemById,
    getUserPoems,
    createPoem,
    editPoem,
    deletePoem,
    getPoemsByTheme,
    getPopularPoems,
    getFollowingFeed,
    getUserLikes,
    getUserSaves
  }
}