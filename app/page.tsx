"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import CountdownTimer from "@/components/CountdownTimer"
import { Heart } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-pink-600 mb-6 relative inline-block"
          whileHover={{ scale: 1.05 }}
        >
          Your Valentine
          <motion.span
            className="absolute -top-4 -right-4 text-red-500"
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Heart size={40} />
          </motion.span>
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CountdownTimer />
      </motion.div>

      <motion.p
        className="text-xl md:text-2xl mb-8 text-center text-pink-800 max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Create a personalized Valentine&apos;s invite for your crush!
      </motion.p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link href="/create">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-6 py-3 rounded-full shadow-lg">
            Create Your Invite
          </Button>
        </Link>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4 right-4 text-center text-pink-700 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Spread love and make someone&apos;s day special!
      </motion.div>
    </div>
  )
}

