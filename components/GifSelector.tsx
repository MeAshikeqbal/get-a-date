"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"

interface GifSelectorProps {
  onSelect: (gif: string) => void
}

export default function GifSelector({ onSelect }: GifSelectorProps) {
  const [search, setSearch] = useState("")
  const [gifs, setGifs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)

  const searchGifs = async () => {
    if (!search.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/gifs?q=${encodeURIComponent(search)}`)
      const data = await response.json()
      setGifs(data.gifs)
    } catch (error) {
      console.error("Error fetching GIFs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGifSelect = (gif: string) => {
    setSelectedGif(gif)
    onSelect(gif)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search GIFs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchGifs()}
          />
          <Button onClick={searchGifs} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {gifs.map((gif, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <img
                src={gif || "/placeholder.svg"}
                alt="GIF"
                className={`w-full h-auto cursor-pointer rounded-md transition-all ${
                  selectedGif === gif ? "ring-4 ring-pink-500" : "hover:ring-2 hover:ring-pink-300"
                }`}
                onClick={() => handleGifSelect(gif)}
              />
            </motion.div>
          ))}
        </div>
        {selectedGif && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <p className="text-sm font-semibold mb-2">Selected GIF:</p>
            <img src={selectedGif || "/placeholder.svg"} alt="Selected GIF" className="w-full h-auto rounded-md" />
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

