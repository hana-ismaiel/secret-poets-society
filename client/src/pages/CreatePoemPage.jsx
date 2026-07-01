import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { usePoems } from "@/hooks/usePoems"
import { useAuth } from "@/hooks/useAuth"
import PoemForm from "@/components/PoemForm"
import { toast } from "sonner"

function CreatePoemPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { createPoem } = usePoems()

  const location = useLocation()
  const prefill = location.state || {}
  const isAiGenerated = !!prefill.isAiGenerated

  const [submitting, setSubmitting] = useState(false)

  async function handleCreatePoem(formData) {
    setSubmitting(true)
    try {
      const newPoem = await createPoem({
        ...formData,
        isAiGenerated,
      })
      toast.success("Poem created successfully")
      navigate(`/poems/${newPoem.id}`)
    } catch (err) {
      setSubmitting(false)
      throw err
    }
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-text text-xl font-semibold mb-3">Create an account</h2>
        <p className="font-text text-muted-foreground mb-6">
          You need an account to publish your poems
        </p>
        <Link 
          to="/register" 
          className="font-text inline-block px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Create an Account
        </Link>
        <p className="font-text text-xs text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-primary">
            Log in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-text text-2xl font-bold mb-6">Create a Poem</h1>

      <PoemForm
        initialTitle={prefill.prefillTitle || ""}
        initialContent={prefill.prefillContent || ""}
        initialThemeIds={[]}
        onSubmit={handleCreatePoem}
        submitting={submitting}
        submitButtonText="Publish"
      />
    </div>
  )
}

export default CreatePoemPage