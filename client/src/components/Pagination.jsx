import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center border-t pt-4 mt-4 select-none">
      <div className="flex items-center gap-1">
        
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
          const pages = []
          
          // Determine starting and ending page positions for a 5-digit window block
          let startPage = Math.max(1, currentPage - 2)
          let endPage = Math.min(totalPages, currentPage + 2)

          // Adjust bounds if forced against the starting boundary wall
          if (currentPage <= 3) {
            startPage = 1
            endPage = Math.min(5, totalPages)
          }

          // Adjust bounds if forced against the ending boundary wall
          if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4)
            endPage = totalPages
          }

          // 1. Render the initial block digits up through our endPage target bounds
          for (let i = startPage; i <= endPage; i++) {
            pages.push(
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

          if (endPage < totalPages) {
            // Only add an ellipsis separator block if there's a numeric gap
            if (endPage < totalPages - 1) {
              pages.push(
                <span key="right-ellipsis" className="text-muted-foreground px-1 text-xs">
                  ...
                </span>
              )
            }
            
            pages.push(
              <Button
                key={totalPages}
                variant={currentPage === totalPages ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 rounded-none p-0 font-medium text-xs"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )
          }

          return pages
        })()}

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