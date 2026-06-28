import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import PoemsSearchPanel from "@/components/PoemsSearchPanel"
import UsersSearchPanel from "@/components/UsersSearchPanel"

const VALID_TABS = ["poems", "users"]

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const rawTab = searchParams.get("tab")
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : "poems"

  function handleTabChange(newTab) {
    setSearchParams({ q: query, tab: newTab })
  }

  if (!query.trim()) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Type something in the search bar to get started
      </p>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="font-text text-2xl font-bold">
        Search results for "{query}"
      </h1>

      <div className="font-text flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "poems" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("poems")}
        >
          Poems
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("users")}
        >
          Users
        </Button>
      </div>

      {activeTab === "poems" && (
        <PoemsSearchPanel key={`poems-${query}`} query={query} />
      )}

      {activeTab === "users" && (
        <UsersSearchPanel key={`users-${query}`} query={query} />
      )}
    </div>
  )
}

export default SearchPage