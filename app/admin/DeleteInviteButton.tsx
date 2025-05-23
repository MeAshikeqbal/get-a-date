"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DeleteInviteButton({
  inviteId,
  refreshInvites,
}: { inviteId: string; refreshInvites: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this invite?")) {
      setIsDeleting(true)
      try {
        const apiKey = localStorage.getItem("adminApiKey")
        const response = await fetch(`/api/invites/${inviteId}`, {
          method: "DELETE",
          headers: {
            "X-API-Key": apiKey || "",
          },
        })
        if (response.ok) {
          toast({
            title: "Invite deleted",
            description: "The invite has been successfully deleted.",
          })
          refreshInvites()
        } else {
          throw new Error("Failed to delete invite")
        }
      } catch (error) {
        console.error("Error deleting invite:", error)
        toast({
          title: "Error",
          description: "Failed to delete the invite. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

