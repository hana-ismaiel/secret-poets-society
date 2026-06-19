import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const placeholderCategories = [
  { id: 1, name: "Love" },
  { id: 2, name: "Grief" },
  { id: 3, name: "Nature" },
  { id: 4, name: "Hope" },
]

function Navbar() {
  const location = useLocation()
  const isLoggedIn = false;

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Categories</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {placeholderCategories.map((category) => (
              <DropdownMenuItem key={category.id}>
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        {isLoggedIn ? (
          <span>Profile placeholder</span>
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