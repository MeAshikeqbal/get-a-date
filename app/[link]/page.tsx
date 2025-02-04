/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import Invite from "@/lib/models/Invite"
import ResponseButtons from "@/components/ResponseButtons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, MessageCircle, Image, BookOpen } from "lucide-react"

async function getInvite(link: string) {
  await dbConnect()
  const invite = await Invite.findOne({ link })
  if (!invite) return null
  return JSON.parse(JSON.stringify(invite))
}

export default async function InvitePage({ params }: { params: Promise<{ link: string }> }) {
  const { link } = await params
  const invite = await getInvite(link)
  
  if (!invite) {
    notFound()
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${getThemeClass(invite.theme)}`}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
            <Heart className="w-8 h-8 mr-2 text-red-500" />
            You&apos;ve Been Invited!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            {!invite.isAnonymous && (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-xl">From: {invite.senderName}</span>
              </div>
            )}
            <Badge variant={invite.theme as "romantic" | "funny" | "mysterious"}>{invite.theme}</Badge>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <MessageCircle className="w-5 h-5 text-gray-500 mt-1" />
              <p className="text-xl">{invite.message}</p>
            </div>
          </div>

          {invite.gif && (
            <div className="flex justify-center">
              <div className="relative">
                <Image className="w-6 h-6 text-gray-500 absolute top-2 left-2" />
                <img
                  src={invite.gif || "/placeholder.svg"}
                  alt="Valentine's GIF"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {invite.poem && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <BookOpen className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">A poem for you:</h2>
                  <p className="italic">{invite.poem}</p>
                </div>
              </div>
            </div>
          )}

          <ResponseButtons inviteId={invite._id} />
        </CardContent>
      </Card>
    </div>
  )
}

function getThemeClass(theme: string) {
  switch (theme) {
    case "romantic":
      return "bg-gradient-to-br from-pink-100 to-red-100"
    case "funny":
      return "bg-gradient-to-br from-yellow-100 to-orange-100"
    case "mysterious":
      return "bg-gradient-to-br from-purple-100 to-indigo-100"
    default:
      return "bg-gradient-to-br from-pink-100 to-red-100"
  }
}

