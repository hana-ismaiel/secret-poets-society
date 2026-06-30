import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAi } from "@/hooks/useAi"
import { useAuth } from "@/hooks/useAuth"
import LoadingSpinner from "@/components/LoadingSpinner"

function AiGenerationPage() {
  const navigate = useNavigate()
  const { generateAiPoem } = useAi()
  const { user } = useAuth()

  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  async function handleGenerate(e) {
    e.preventDefault()
    setError("")

    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setGenerating(true)
    try {
      const data = await generateAiPoem(prompt)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong generating your poem")
    } finally {
      setGenerating(false)
    }
  }

  function handleUsePoem() {
    // Pass the generated poem to the Create Poem page,
    // pre-filling the form so the user can review/edit before publishing
    navigate("/poems/create", {
      state: {
        prefillTitle: result.title,
        prefillContent: result.content,
        isAiGenerated: true,
      },
    })
  }

  if (!user) {
    return (
      <div className="font-text max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Create an account or sign in to use this feature
        </p>
        <Link to="/register">
          <Button>Create Account</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkle size={22} className="text-emerald-600" />
        <h1 className="font-text text-2xl font-bold">AI Poem Generator</h1>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <Textarea
          placeholder="Enter a prompt for your poem (e.g. 'a quiet walk in the woods', 'short haiku about friendship')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="font-text border-emerald-600 focus-visible:ring-emerald-200"
        />

        {error && <p className="font-text text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={generating} className="font-text w-fit">
          {generating ? "Writing your poem..." : "Generate Poem"}
        </Button>
      </form>

      {generating && (
        <div className="flex flex-col items-center justify-center gap-3 mt-12 pt-6 border-t">
          <LoadingSpinner />
        </div>
      )}

      {!generating && result && (
        <div className="font-text mt-10 border-t pt-8">
          <h2 className="text-xl font-bold mb-2">{result.title}</h2>
          <p className="whitespace-pre-line text-md leading-relaxed mb-6">
            {result.content}
          </p>

          <div className="flex gap-2">
            <Button onClick={handleUsePoem}>
              Use This Poem
            </Button>
            <Button variant="outline" onClick={() => setResult(null)}>
              Generate Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AiGenerationPage