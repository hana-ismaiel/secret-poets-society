import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link } from "react-router-dom"
import LikeButton from "./LikeButton"
import SaveButton from "./SaveButton"
import { useAuth } from "@/hooks/useAuth"

function PoemCard({ poem }) {
  const { user: currentUser } = useAuth()
  const isOwnPoem = currentUser && String(currentUser.id) === String(poem.author_id)

  return (
    <Card className="mb-8 rounded-none">
      <CardHeader>
        <Link to={`/poems/${poem.id}`} className="hover:underline">
          <CardTitle className="text-2xl font-bold">{poem.title}</CardTitle>
        </Link>
        <CardDescription className="text-lg">
            by {" "}
            <Link to={`/users/${poem.author_id}`} className="text-primary hover:underline font-medium">
                {poem.author}
            </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{poem.content}</p>
        {poem.categories && poem.categories.length > 0 && (
          <div className="flex gap-2 mt-4">
            {poem.categories.map((category) => (
              <span
                key={category.id}
                className="text-xs bg-muted px-2 py-1 rounded-full"
              >
                {category.name}
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