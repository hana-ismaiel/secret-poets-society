import { Link } from "react-router-dom"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useThemes } from "@/hooks/useThemes"

function ThemesPage() {
  const { themes, loading: themesLoading } = useThemes()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-text text-2xl font-bold mb-8">Explore Themes</h1>

      {themesLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              to={`/themes/${theme.pathname}`}
              className="text-sm px-4 py-1.5 rounded-full border text-muted-foreground hover:bg-muted"
            >
              {theme.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemesPage