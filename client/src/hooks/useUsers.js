import api from "@/lib/api"

export function useUsers() {
  
  async function getUserById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  }

  return { getUserById }
}