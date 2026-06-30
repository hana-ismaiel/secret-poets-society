import api from "@/lib/api"

export function useUsers() {
  
  async function getUserById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  }

  async function searchUsers(q, page = 1, limit) {
    const url = limit
      ? `/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
      : `/users/search?q=${encodeURIComponent(q)}&page=${page}`;
    const response = await api.get(url);
    return response.data;
  }

  async function updateBio(bio) {
    const response = await api.put(`/users/bio`, { bio });
    return response.data;
  }

  async function updateAvatarColor(avatarColor) {
  const response = await api.put("/users/avatar-color", { avatarColor })
  return response.data
}

  return { getUserById, searchUsers, updateBio, updateAvatarColor }
}