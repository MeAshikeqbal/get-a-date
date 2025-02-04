"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ResponseButtonsProps {
  inviteId: string
}

export default function ResponseButtons({ inviteId }: ResponseButtonsProps) {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [responderId, setResponderId] = useState<string | null>(null)

  useEffect(() => {
    // Generate a unique responderId if it doesn't exist
    const storedResponderId = localStorage.getItem("responderId")
    if (storedResponderId) {
      setResponderId(storedResponderId)
    } else {
      const newResponderId = Math.random().toString(36).substr(2, 9)
      localStorage.setItem("responderId", newResponderId)
      setResponderId(newResponderId)
    }

    // Check if user has already responded
    const storedResponse = localStorage.getItem(`response_${inviteId}`)
    if (storedResponse) {
      setResponse(storedResponse)
    }
  }, [inviteId])

  const handleResponse = async (choice: string) => {
    if (response) {
      toast({
        title: "Already Responded",
        description: "You've already responded to this invite.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteId, response: choice, responderId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit response")
      setResponse(choice)
      localStorage.setItem(`response_${inviteId}`, choice)
      toast({
        title: "Response Submitted",
        description: `You responded with: ${choice}`,
      })
    } catch (error) {
      console.error("Error submitting response:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Will you be my Valentine?</h3>
      {!response ? (
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => handleResponse("Yes")}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600"
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            Yes
          </Button>
          <Button
            onClick={() => handleResponse("Maybe")}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Maybe
          </Button>
          <Button onClick={() => handleResponse("No")} disabled={isLoading} className="bg-red-500 hover:bg-red-600">
            <ThumbsDown className="w-5 h-5 mr-2" />
            No
          </Button>
        </div>
      ) : null}
      {response && (
        <p className="text-center text-lg font-semibold animate-fade-in">
          Your response: <span className="text-pink-600">{response}</span>
        </p>
      )}
    </div>
  )
}