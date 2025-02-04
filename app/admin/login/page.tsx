"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const [apiKey, setApiKey] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    })
    const data = await response.json()
    if (data.authenticated) {
      localStorage.setItem("adminApiKey", apiKey)
      router.push("/admin")
    } else {
      alert("Invalid API Key")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Admin Authentication</h2>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          className="w-full p-2 mb-4 border rounded"
        />
        <Button type="submit" className="w-full bg-pink-500 text-white">
          Authenticate
        </Button>
      </form>
    </div>
  )
}