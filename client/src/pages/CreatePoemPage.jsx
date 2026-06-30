import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { usePoems } from "@/hooks/usePoems"
import PoemForm from "@/components/PoemForm"

function CreatePoemPage() {
  const navigate = useNavigate()
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
      navigate(`/poems/${newPoem.id}`)
    } catch (err) {
      setSubmitting(false)
      throw err
    }
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