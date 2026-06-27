import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MoreVertical, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePoems } from "@/hooks/usePoems"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function PoemActions({ poem, onDeleteSuccess }) {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { deletePoem } = usePoems()
  const [open, setOpen] = useState(false)

  const isOwner = currentUser && String(currentUser.id) === String(poem.author_id)

  if (!isOwner) return null

  async function handleDelete() {
    try {
      await deletePoem(poem.id)
      setOpen(false)
      if (onDeleteSuccess) {
        onDeleteSuccess(poem.id) // Pass deleted poem ID to the callback
      } else {
        navigate("/") // Fallback (if no callback provided)
      }
    } catch (err) {
      console.error("Failed to delete poem:", err)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreVertical size={18} className="text-muted-foreground" />
            <span className="sr-only">Open actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => navigate(`/poems/edit/${poem.id}`)}>
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault()
              setOpen(true)
            }} 
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you delete this poem, it cannot be restored.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
          >
            Delete Poem
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PoemActions