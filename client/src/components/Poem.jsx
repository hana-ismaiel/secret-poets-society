import { Link } from "react-router-dom"
import LikeButton from "./LikeButton"
import SaveButton from "./SaveButton"
import PoemActions from "./PoemActions"
import AiGeneratedBadge from "./AiGeneratedBadge"
import { useAuth } from "@/hooks/useAuth"

function Poem({ poem }) {
  const { user: currentUser } = useAuth()
  const isOwnPoem = currentUser && String(currentUser.id) === String(poem.author_id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 relative">
      <div className="absolute top-12 right-4">
        <PoemActions poem={poem} />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="font-text text-3xl font-bold mb-2">{poem.title}</h1>
        {poem.is_ai_generated && <AiGeneratedBadge />}
      </div>
      

      <p className="text-lg mb-8">
        by{" "}
        <Link
          to={`/users/${poem.author}`}
          className="font-text-italic text-primary hover:underline font-medium"
        >
          {poem.author}
        </Link>
      </p>

      <p className="font-text whitespace-pre-line text-lg leading-relaxed">
        {poem.content}
      </p>

      {poem.themes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10">
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
      
    </div>
  )
}

export default Poem