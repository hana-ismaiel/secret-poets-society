import api from "@/lib/api"

export function useFollows() {
  async function toggleFollow(userId) {
    const response = await api.post(`/follows/toggle/${userId}`)
    return response.data
  }

  async function checkIsFollowing(userId) {
    const response = await api.get(`/follows/check/${userId}`)
    return response.data
  }

  async function getFollowerCount(userId) {
    const response = await api.get(`/follows/followers/count/${userId}`)
    return response.data
  }

  async function getFollowingCount(userId) {
    const response = await api.get(`/follows/following/count/${userId}`)
    return response.data
  }

  async function getFollowers(userId, page = 1, limit) {
    const url = limit
      ? `/follows/${userId}/followers?page=${page}&limit=${limit}`
      : `/follows/${userId}/followers?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  async function getFollowing(userId, page = 1, limit) {
    const url = limit
      ? `/follows/${userId}/following?page=${page}&limit=${limit}`
      : `/follows/${userId}/following?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  return { 
    toggleFollow,
    checkIsFollowing,
    getFollowerCount,
    getFollowingCount,
    getFollowers,
    getFollowing,
  }
}