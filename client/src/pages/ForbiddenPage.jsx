import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

function ForbiddenPage() {
  return (
    <div className="font-text min-h-[70vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto gap-4">
      <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-destructive">
        403
      </h1>
      
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          Access Forbidden
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You are not authorized to view this page
        </p>
      </div>

      <Link to="/" className="mt-2">
        <Button className="font-medium px-5 py-4 cursor-pointer">
          Explore Newest Poems
        </Button>
      </Link>
    </div>
  )
}

export default ForbiddenPage