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

  async function getFollowingFeed(page = 1, limit) {
    const url = limit ? `/follows/feed?page=${page}&limit=${limit}` : `/follows/feed?page=${page}`;
    const response = await api.get(url)
    return response.data
  }

  async function getFollowers(userId) {
  const response = await api.get(`/follows/${userId}/followers`)
  return response.data
}

async function getFollowing(userId) {
  const response = await api.get(`/follows/${userId}/following`)
  return response.data
}

  return { 
    toggleFollow,
    checkIsFollowing,
    getFollowerCount,
    getFollowingCount,
    getFollowingFeed,
    getFollowers,
    getFollowing,
  }
}