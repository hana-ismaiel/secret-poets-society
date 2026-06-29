import { useState } from "react"
import { Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUsers } from "@/hooks/useUsers"

function UserBio({ user, isOwnProfile, onBioUpdated }) {
  const { updateBio } = useUsers()
  const [isEditing, setIsEditing] = useState(false)
  const [bioText, setBioText] = useState(user?.bio || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    setLoading(true)
    setError("")
    try {
      const updatedUserData = await updateBio(bioText)
      setIsEditing(false)
      if (onBioUpdated) {
        onBioUpdated(updatedUserData.bio)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bio")
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setBioText(user.bio || "")
    setIsEditing(false)
    setError("")
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Textarea
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          placeholder="Give a brief description about yourself"
          maxLength={500}
          rows={3}
          className="text-sm rounded-none resize-none font-text"
          disabled={loading}
        />
        {error && <p className="text-xs text-red-500 font-text">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCancel} 
            disabled={loading} 
            className="h-8 w-8 text-muted-foreground cursor-pointer"
          >
            <X size={16} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSave} 
            disabled={loading} 
            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            <Check size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative w-full pr-8">
      <p className="text-sm text-slate-700 whitespace-pre-line break-words italic min-h-[20px] font-text">
        {user.bio || ("No biography provided yet.")}
      </p>
      
      {isOwnProfile && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute right-0 top-0 p-1 rounded-md text-muted-foreground hover:text-emerald-600 hover:bg-muted transition-all cursor-pointer"
        >
          <Edit2 size={16} />
        </button>
      )}
    </div>
  )
}

export default UserBio