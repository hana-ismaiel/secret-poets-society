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

  return { toggleSaved, checkUserSaved }
}