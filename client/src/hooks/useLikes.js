import api from "@/lib/api"

export function useLikes() {
  async function toggleLike(poemId) {
    const response = await api.post(`/likes/toggle/${poemId}`)
    return response.data
  }

  async function getLikeCount(poemId) {
    const response = await api.get(`/likes/count/${poemId}`)
    return response.data
  }

  async function checkUserLiked(poemId) {
    const response = await api.get(`/likes/check/${poemId}`)
    return response.data
  }

  async function getUserLikes(page = 1, limit) {
    const url = limit ? `/likes/my-likes?page=${page}&limit=${limit}` : `/likes/my-likes?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  return { toggleLike, getLikeCount, checkUserLiked, getUserLikes }
}