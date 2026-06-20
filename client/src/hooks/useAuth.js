import { createContext, useContext, useState } from "react"
import api from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  async function login(email, password) {
    const response = await api.post("/users/login", { email, password })
    setUser(response.data.user)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    localStorage.setItem("token", response.data.token)
  }

  async function register(username, email, password) {
    await api.post("/users/register", { username, email, password })
    await login(email, password)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}