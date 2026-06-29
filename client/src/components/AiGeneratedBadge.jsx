import { Sparkle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"

function AiGeneratedBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center">
            <Sparkle size={18} className="fill-emerald-600 text-emerald-600" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>This poem may have been generated or inspired by AI</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AiGeneratedBadge