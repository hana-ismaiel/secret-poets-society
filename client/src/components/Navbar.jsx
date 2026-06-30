import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import SearchBar from "./SearchBar"
import { useAuth } from "@/hooks/useAuth"

function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  // Do not show Navbar if on login page or register page
  const hideNavbarRoutes = ["/login", "/register"]

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b gap-4 bg-warm">
      <Link to="/" className="font-title text-2xl font-semibold">
        Secret Poets Society
      </Link>

      {!hideNavbarRoutes.includes(location.pathname) ? <SearchBar/> : null}

      <div className="font-text">
        {user ? (
          <div className="flex items-center gap-2">
            <Link to={`/users/${user.username}`} className="font-bold">{user.username}</Link>
            <Button variant="outline" onClick={logout}>Sign Out</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar