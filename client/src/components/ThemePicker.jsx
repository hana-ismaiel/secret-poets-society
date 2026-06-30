import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/LoadingSpinner"

function ThemePicker({ 
  isOpen, 
  onClose, 
  themes, 
  themesLoading, 
  selectedThemeIds, 
  onToggleTheme, 
  maxThemes 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="bg-background w-full max-w-md rounded-xl p-6 shadow-xl border flex flex-col gap-4">
        
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-text font-semibold text-lg">Select Themes</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 cursor-pointer">
            <X size={18} />
          </Button>
        </div>

        <p className="font-text text-sm text-muted-foreground">
          Choose up to {maxThemes} themes
        </p>

        <div className="min-h-[120px] py-2 flex items-center justify-center">
          {themesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-wrap gap-2 justify-start w-full align-top">
              {themes.map((theme) => {
                const isSelected = selectedThemeIds.includes(theme.id)
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onToggleTheme(theme.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-lime-600 text-white border-lime-600 font-medium"
                        : "text-muted-foreground hover:bg-muted border-input"
                    }`}
                  >
                    {theme.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button onClick={onClose} className="font-text text-xs px-4 h-9 cursor-pointer">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ThemePicker