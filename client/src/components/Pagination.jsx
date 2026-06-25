import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Helper helper function to render buttons for page numbers from [start, end]
  const renderButtons = (start, end) => {
    const buttons = []
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 rounded-none p-0 font-medium text-xs"
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      )
    }
    return buttons
  }

  return (
    <div className="flex items-center justify-center border-t pt-4 mt-4 select-none">
      <div className="flex items-center gap-1">
        
        {/* Back arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          <ChevronLeft size={16} />
        </Button>

        {(() => {
          // If 10 or less total pages, display all
          if (totalPages <= 10) {
            return renderButtons(1, totalPages)
          }

          // If 11 or more total pages
          
          // Case A: First 5 pages -> < 1 2 3 4 5 ... Last >
          if (currentPage <= 5) {
            return [
              ...renderButtons(1, 5),
              <span key="right-ellipsis" className="text-muted-foreground px-1 text-xs">...</span>,
              ...renderButtons(totalPages, totalPages)
            ]
          }

          // Case B: Right Last 5 pages -> < 1 ... (Last-4) (Last-3) (Last-2) (Last-1) Last >
          if (currentPage >= totalPages - 4) {
            return [
              ...renderButtons(1, 1),
              <span key="left-ellipsis" className="text-muted-foreground px-1 text-xs">...</span>,
              ...renderButtons(totalPages - 4, totalPages)
            ]
          }

          // Case C: Between first 5 and last 5 -> < 1 ... x-2 x-1 X x+1 x+2 ... Last >
          return [
            ...renderButtons(1, 1),
            <span key="left-ellipsis" className="text-muted-foreground px-1 text-xs">...</span>,
            ...renderButtons(currentPage - 2, currentPage + 2),
            <span key="right-ellipsis" className="text-muted-foreground px-1 text-xs">...</span>,
            ...renderButtons(totalPages, totalPages)
          ]
        })()}

        {/* Forward arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          <ChevronRight size={16} />
        </Button>

      </div>
    </div>
  )
}

export default Pagination