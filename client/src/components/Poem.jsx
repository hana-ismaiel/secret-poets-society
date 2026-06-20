import { Link } from "react-router-dom"

function Poem({ poem }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{poem.title}</h1>

      <p className="text-lg mb-8">
        by{" "}
        <Link
          to={`/users/${poem.author_id}`}
          className="text-primary hover:underline font-medium"
        >
          {poem.author}
        </Link>
      </p>

      <p className="whitespace-pre-line text-lg leading-relaxed">
        {poem.content}
      </p>

      {poem.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10">
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
    </div>
  )
}

export default Poem