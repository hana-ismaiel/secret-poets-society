import PoemCard from '@/components/PoemCard'

const fakePoems = [
  {
    id: 1,
    title: "Quiet Mornings",
    author: "poetrylover",
    content: "The sun creeps in\nsoftly, slowly,\nlike it's afraid to wake the world.",
    categories: [{ id: 1, name: "Nature" }]
  },
  {
    id: 2,
    title: "Untitled",
    author: "Anonymous",
    content: "I carry your name\nlike a stone in my pocket,\nheavy, but mine.",
    categories: [{ id: 2, name: "Love" }, { id: 3, name: "Grief" }]
  }
]

function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {fakePoems.map((poem) => (
        <PoemCard key={poem.id} poem={poem} />
      ))}
    </div>
  )
}

export default HomePage