import { useState, useEffect } from "react"
import PoemCard from "@/components/PoemCard"
import { usePoems } from "@/hooks/usePoems"
import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"

function PopularPage() {
  const { getPopularPoems } = usePoems()
  const [poems, setPoems] = useState([])
  const [timeframe, setTimeframe] = useState("all") // "all", "24h", "7d"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPopularPoems(timeframe)
        setPoems(data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="text-orange-500" size={28} />
        <h1 className="text-3xl font-bold">Trending Poems</h1>
      </div>

      <div className="flex gap-2 border-b pb-4 mb-8">
        <Button
          variant={timeframe === "all" ? "default" : "outline"}
          onClick={() => setTimeframe("all")}
          className="rounded-none text-xs h-9"
        >
          All Time
        </Button>
        <Button
          variant={timeframe === "24h" ? "default" : "outline"}
          onClick={() => setTimeframe("24h")}
          className="rounded-none text-xs h-9"
        >
          Past 24 Hours
        </Button>
        <Button
          variant={timeframe === "7d" ? "default" : "outline"}
          onClick={() => setTimeframe("7d")}
          className="rounded-none text-xs h-9"
        >
          Past 7 Days
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground mt-10">Loading popular works...</p>
      ) : error ? (
        <p className="text-center text-destructive mt-10">{error}</p>
      ) : poems.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No trending poems found in this range.</p>
      ) : (
        <div className="flex flex-col">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PopularPage