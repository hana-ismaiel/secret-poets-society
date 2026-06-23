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

  async function getFollowingFeed() {
    const response = await api.get("follows/feed")
    return response.data
  }

  return { toggleFollow, checkIsFollowing, getFollowerCount, getFollowingCount, getFollowingFeed }
}