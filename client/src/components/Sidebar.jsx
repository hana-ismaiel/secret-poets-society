import { Link, useLocation } from "react-router-dom"
import { Home, Users, TrendingUp, PenSquare, Tags, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
  { label: "Newest Poems", path: "/", icon: Home },
  { label: "Following", path: "/following", icon: Users },
  { label: "Popular", path: "/popular", icon: TrendingUp },
  { label: "Explore Themes", path: "/themes", icon: Tags },
]


function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const hideSidebarRoutes = ["/login", "/register"]
  if (hideSidebarRoutes.includes(location.pathname)) {
    return null
  }

  return (
    <aside className="w-58 border-r px-4 py-6 hidden md:block">

      {user && (
        <div className="flex flex-col gap-4">
          <Link to="/poems/create" className="gap-4">
            <Button className="font-text w-full gap-2">
              <PenSquare size={16} />
              Create Poem
            </Button>
            
          </Link>
          <div>{" "}</div>
        </div>
        
      )}

      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={`font-text flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-muted font-medium" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
        <Link
          to="/ai-generation"
          className={`font-text flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
            location.pathname === "/ai-generation"
              ? "bg-emerald-500/10 text-emerald-600 font-medium"
              : "hover:bg-emerald-500/10 hover:text-emerald-600 text-muted-foreground"
          }`}
        >
          <Sparkle size={18} />
          AI Poem Generation
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar