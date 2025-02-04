"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Heart, Send, Loader2 } from "lucide-react"
import GifSelector from "@/components/GifSelector"

export default function CreateInvite() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
    isAnonymous: false,
    theme: "romantic",
    gif: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (
      !formData.senderName ||
      !formData.recipientName ||
      !formData.message ||
      !formData.senderEmail
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.link) {
        toast({
          title: "Success",
          description: "Your Valentine's invite has been created!",
        })
        router.push(`/${data.link}`)
      } else {
        throw new Error("Failed to create invite")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to create invite. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-pink-100 to-red-100 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-pink-600 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
              <Heart className="w-8 h-8 mr-2 text-red-500" />
            </motion.div>
            Create Your Valentine&apos;s Invite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Label htmlFor="senderName">Your Name</Label>
              <Input
                id="senderName"
                placeholder="Your Name"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                required
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label htmlFor="senderEmail">Your Email</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                required
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label htmlFor="recipientName">Recipient&apos;s Name</Label>
              <Input
                id="recipientName"
                placeholder="Recipient's Name"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                required
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Label htmlFor="recipientEmail">Recipient&apos;s Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@email.com"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </motion.div>
            <motion.div
              className="flex items-center space-x-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Switch
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked })}
              />
              <Label htmlFor="anonymous">Send Anonymously</Label>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Label htmlFor="theme">Theme</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, theme: value })}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                  <SelectItem value="mysterious">Mysterious</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Label>Choose a GIF</Label>
              <GifSelector onSelect={(gif) => setFormData({ ...formData, gif })} />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create Invite
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

