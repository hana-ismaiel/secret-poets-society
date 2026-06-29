import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link } from "react-router-dom"
import LikeButton from "./LikeButton"
import SaveButton from "./SaveButton"
import PoemActions from "./PoemActions"
import AiGeneratedBadge from "./AiGeneratedBadge"
import { useAuth } from "@/hooks/useAuth"

function PoemCard({ poem, onDeleteSuccess }) {
  const { user: currentUser } = useAuth()
  const isOwnPoem = currentUser && String(currentUser.id) === String(poem.author_id)

  return (
    <Card className="mb-8 rounded-none relative bg-poem">
      <div className="absolute top-4 right-4 z-10">
        <PoemActions poem={poem} onDeleteSuccess={onDeleteSuccess}/>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link to={`/poems/${poem.id}`} className="hover:underline">
            <CardTitle className="font-text text-2xl font-bold">{poem.title}</CardTitle>
          </Link>
          {poem.is_ai_generated && <AiGeneratedBadge />}
        </div>
        <CardDescription className="font-text text-lg">
            by {" "}
            <Link to={`/users/${poem.author_id}`} className="font-text-italic text-primary hover:underline font-medium">
                {poem.author}
            </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-text whitespace-pre-line">{poem.content}</p>
        {poem.themes && poem.themes.length > 0 && (
          <div className="flex gap-2 mt-4">
            {poem.themes.map((theme) => (
              <span
                key={theme.id}
                className="text-xs bg-muted px-2 py-1 rounded-full"
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 pt-3 border-t flex items-center gap-4">
          <LikeButton poemId={poem.id} />
          {!isOwnPoem && <SaveButton poemId={poem.id} />}
        </div>
      </CardContent>
    </Card>
  )
}

export default PoemCard