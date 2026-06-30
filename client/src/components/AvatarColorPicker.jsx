import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsers } from "@/hooks/useUsers"
import { AVATAR_COLORS, getAvatarColorClass } from "@/lib/avatarColors"

function AvatarColorPicker({ user, onColorUpdated, onCancel }) {
  const { updateAvatarColor } = useUsers()
  const [selectedColor, setSelectedColor] = useState(user.avatar_color)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const updatedUser = await updateAvatarColor(selectedColor)
      onColorUpdated(updatedUser)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Avatar className={`w-20 h-20 ${getAvatarColorClass(selectedColor)}`}>
        <AvatarFallback className={`text-xl text-white ${getAvatarColorClass(selectedColor)}`}>
          {user.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-wrap justify-center gap-2">
        {AVATAR_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`w-7 h-7 rounded-full border-2 cursor-pointer ${getAvatarColorClass(color)} ${
              selectedColor === color ? "border-foreground" : "border-transparent"
            }`}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      {error && <p className="font-text text-sm text-red-500">{error}</p>}
      
      <div className="font-text flex justify-end gap-2 w-full">
        <Button variant="outline" size="sm" onClick={onCancel} className="cursor-pointer">
          <X size={16} />
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving} className="cursor-pointer">
          <Check size={16}/>
        </Button>
      </div>
    </div>
  )
}

export default AvatarColorPicker