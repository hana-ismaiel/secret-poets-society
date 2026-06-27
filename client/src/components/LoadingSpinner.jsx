import { Loader2 } from "lucide-react"

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8 w-full min-h-[200px]">
      <Loader2 className="animate-spin text-primary w-8 h-8" />
    </div>
  )
}

export default LoadingSpinner