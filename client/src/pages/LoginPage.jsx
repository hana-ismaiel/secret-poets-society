import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

import backgroundImage from "../assets/login-register-image.jpg" 

function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, user: currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    try {
      await login(username, password)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  if (currentUser) return null

  return (
    <div className="font-text min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl grid md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden min-h-[600px]">
        {/* Left panel */}
        <div className="relative hidden md:flex flex-col justify-end items-center text-center p-12 text-black bg-warm">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${backgroundImage})` 
            }}
          />
          <div className="relative z-10 flex flex-col gap-3 mx-auto">
            <h1 className="text-3xl font-bold leading-tight">
              Join our community of poetry lovers.
            </h1>
            <p className="text-sm text-gray-800 max-w-sm font-medium leading-relaxed">
              Showcase your poetry and get free access to unlimited poems by like-minded creators.
            </p>
          </div>
        </div>
        
        {/* Right panel */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <Card className="w-full max-w-md p-6 md:p-8 border rounded-xl shadow-sm">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="font-text text-2xl md:text-3xl font-bold">
                Sign In
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-lg font-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg font-text"
                  />
                </div>

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                
                <Button type="submit" className="w-full py-5 rounded-lg mt-2 font-medium cursor-pointer">
                  Sign In
                </Button>
              </form>

              <p className="text-sm text-center text-muted-foreground mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="underline font-medium text-foreground hover:text-lime-600 cursor-pointer">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
  
export default LoginPage