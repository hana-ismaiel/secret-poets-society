import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

function SearchBar() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState("")

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (!searchInput.trim()) return
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
  }

  return (
    <form onSubmit={handleSearchSubmit} className="font-text flex items-center gap-4 flex-1 max-w-md">
      <Input
        type="text"
        placeholder="Search poems..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="bg-white"
      />
    </form>
  )
}

export default SearchBar