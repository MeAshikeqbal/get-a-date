"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, UserCheck, UserMinus, ThumbsUp, ThumbsDown, HelpCircle, Mail } from "lucide-react"
import DeleteInviteButton from "./DeleteInviteButton"

interface AdminData {
  invites: {
    _id: string
    senderName: string
    recipientName: string
    theme: string
    isAnonymous: boolean
    createdAt: string
    emailSent: boolean
    response: string
  }[]
  totalInvites: number
  anonymousInvites: number
  totalEmailsSent: number
}

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)

  const fetchAdminData = async () => {
    const apiKey = localStorage.getItem("adminApiKey")
    const response = await fetch("/api/admin/data", {
      headers: {
        "X-API-Key": apiKey || "",
      },
    })
    const data = await response.json()
    return data
  }

  useEffect(() => {
      const fetchData = async () => {
        const data = await fetchAdminData()
        setAdminData(data)
      }
  
      fetchData()
    }, [])

  const refreshInvites = async () => {
    const updatedData = await fetchAdminData()
    setAdminData(updatedData)
  }

  if (!adminData) {
    return <div>Loading...</div>
  }

  const { invites, totalInvites, anonymousInvites, totalEmailsSent } = adminData

  const getResponseIcon = (response: string) => {
    switch (response) {
      case "Yes":
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case "No":
        return <ThumbsDown className="h-4 w-4 text-red-500" />
      case "Maybe":
        return <HelpCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className=" min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">Valentine&apos;s Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
            <Heart className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvites}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anonymous Invites</CardTitle>
            <UserMinus className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anonymousInvites}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Named Invites</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvites - anonymousInvites}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmailsSent}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6 text-pink-600" />
            Recent Invites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Anonymous</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Email Sent</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite._id}>
                  <TableCell className="font-medium">{invite.senderName || "Anonymous"}</TableCell>
                  <TableCell>{invite.recipientName}</TableCell>
                  <TableCell>
                    <Badge variant={invite.theme as "romantic" | "funny" | "mysterious"}>{invite.theme}</Badge>
                  </TableCell>
                  <TableCell>{invite.isAnonymous ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(invite.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{invite.emailSent ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getResponseIcon(invite.response)}
                      <span>{invite.response}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DeleteInviteButton inviteId={invite._id} refreshInvites={refreshInvites} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}