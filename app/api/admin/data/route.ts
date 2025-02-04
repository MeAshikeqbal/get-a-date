import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Invite from "@/lib/models/Invite"

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("X-API-Key")
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const invites = await Invite.find().sort({ createdAt: -1 }).limit(10)
    const totalInvites = await Invite.countDocuments()
    const anonymousInvites = await Invite.countDocuments({ isAnonymous: true })
    const totalEmailsSent = await Invite.countDocuments({ emailSent: true })

    const invitesWithResponse = invites.map((invite) => ({
      ...JSON.parse(JSON.stringify(invite)),
      response: invite.responses[0] || "No Response",
    }))

    return NextResponse.json({
      invites: invitesWithResponse,
      totalInvites,
      anonymousInvites,
      totalEmailsSent,
    })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}