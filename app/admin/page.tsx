"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "./AdminDashboard"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const apiKey = localStorage.getItem("adminApiKey")
      if (!apiKey) {
        router.push("/admin/login")
        return
      }

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })
      const data = await response.json()

      if (!data.authenticated) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return <AdminDashboard />
}

