import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useThemes } from "@/hooks/useThemes"
import ThemePicker from "@/components/ThemePicker"

const MAX_THEMES = 3

function PoemForm({ 
  initialTitle = "", 
  initialContent = "", 
  initialThemeIds = [], 
  onSubmit, 
  submitting, 
  submitButtonText = "Publish" 
}) {
  const { themes, loading: themesLoading } = useThemes()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [selectedThemeIds, setSelectedThemeIds] = useState(initialThemeIds)
  const [error, setError] = useState("")
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)

  const isFormValid = title.trim().length > 0 && content.trim().length > 0

  function toggleTheme(themeId) {
    setSelectedThemeIds((prev) => {
      if (prev.includes(themeId)) {
        return prev.filter((id) => id !== themeId)
      }
      if (prev.length >= MAX_THEMES) {
        return prev
      }
      return [...prev, themeId]
    })
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    if (!isFormValid) return

    setError("")
    try {
      await onSubmit({ title, content, themeIds: selectedThemeIds })
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="font-text text-sm font-semibold text-muted-foreground">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-text py-5 rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-text text-sm font-semibold text-muted-foreground">
          Poem Content <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="font-text rounded-lg resize-y"
        />
      </div>

      <div className="rounded-xl flex flex-col gap-3">
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsThemePickerOpen(true)}
            className="font-text gap-1 text-xs cursor-pointer h-9"
          >
            <Plus size={14} /> Add Themes
          </Button>
        </div>

        {selectedThemeIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed">
            {themes
              .filter((t) => selectedThemeIds.includes(t.id))
              .map((theme) => (
                <span
                  key={theme.id}
                  className="text-xs bg-lime-100 text-lime-800 px-2.5 py-0.5 rounded-full border border-lime-200"
                >
                  {theme.name}
                </span>
              ))}
          </div>
        )}
      </div>

      {error && <p className="font-text text-sm text-red-500 font-medium">{error}</p>}

      <Button 
        type="submit" 
        disabled={submitting || !isFormValid} 
        className="font-text px-6 py-5 rounded-lg w-fit mt-2 font-medium cursor-pointer"
      >
        {submitting ? "Saving Changes..." : submitButtonText}
      </Button>

      <ThemePicker
        isOpen={isThemePickerOpen}
        onClose={() => setIsThemePickerOpen(false)}
        themes={themes}
        themesLoading={themesLoading}
        selectedThemeIds={selectedThemeIds}
        onToggleTheme={toggleTheme}
        maxThemes={MAX_THEMES}
      />
    </form>
  )
}

export default PoemForm