import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { usePoems } from "@/hooks/usePoems"
import LoadingSpinner from "@/components/LoadingSpinner"
import PoemForm from "@/components/PoemForm"

function EditPoemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editPoem, getPoemById } = usePoems() 

  const [poem, setPoem] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    async function loadPoem() {
      try {
        const data = await getPoemById(id)
        setPoem(data)
      } catch (err) {
        setFetchError(err.response?.data?.message || "Could not retrieve poem data")
      } finally {
        setInitialLoading(false)
      }
    }
    loadPoem()
  }, [id, getPoemById])

  async function handleUpdatePoem(updatedFields) {
    setSubmitting(true)
    try {
      await editPoem(id, updatedFields)
      navigate(`/poems/${id}`)
    } catch (err) {
      setSubmitting(false)
      throw err
    }
  }

  if (initialLoading) return <LoadingSpinner />
  if (fetchError) return <p className="font-text text-center text-red-500 mt-10">{fetchError}</p>
  if (!poem) return <p className="font-text text-center text-muted-foreground mt-10">Poem not found.</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-text text-2xl font-bold mb-6">Edit Your Poem</h1>

      <PoemForm
        initialTitle={poem.title}
        initialContent={poem.content}
        initialThemeIds={poem.themes ? poem.themes.map((t) => t.id) : []}
        onSubmit={handleUpdatePoem}
        submitting={submitting}
        submitButtonText="Save Changes"
      />
    </div>
  )
}

export default EditPoemPage