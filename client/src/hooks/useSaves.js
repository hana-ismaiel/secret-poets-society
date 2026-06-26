import api from "@/lib/api"

export function useSaves() {
  async function toggleSaved(poemId) {
    const response = await api.post(`/saved/toggle/${poemId}`)
    return response.data
  }

  async function checkUserSaved(poemId) {
    const response = await api.get(`/saved/check/${poemId}`)
    return response.data
  }

  async function getUserSaves(page = 1, limit) {
    const url = limit ? `/saved/my-saved?page=${page}&limit=${limit}` : `/saved/my-saved?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  return { toggleSaved, checkUserSaved, getUserSaves }
}