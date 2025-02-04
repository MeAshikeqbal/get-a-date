"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilValentines())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilValentines())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function getTimeUntilValentines() {
    const now = new Date()
    const valentinesDay = new Date(now.getFullYear(), 1, 14)
    if (now > valentinesDay) {
      valentinesDay.setFullYear(valentinesDay.getFullYear() + 1)
    }
    const difference = valentinesDay.getTime() - now.getTime()

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return (
    <div className="flex space-x-4 mb-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-3xl md:text-4xl font-bold text-pink-600 bg-white rounded-lg p-3 shadow-md"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            {value.toString().padStart(2, "0")}
          </motion.div>
          <div className="text-sm text-pink-700 mt-1 capitalize">{unit}</div>
        </motion.div>
      ))}
    </div>
  )
}

