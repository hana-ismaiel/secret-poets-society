import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  // Do not show Navbar if on login page or register page
  const hideNavbarRoutes = ["/login", "/register"]
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b gap-4">
      <Link to="/" className="text-xl font-semibold">
        Secret Poets Society
      </Link>

      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Input type="text" placeholder="Search poems..." />
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-2">
            <Link to={`/users/${user.id}`}>{user.username}</Link>
            <Button variant="outline" onClick={logout}>Sign Out</Button>
          </div>
        ) : (
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar