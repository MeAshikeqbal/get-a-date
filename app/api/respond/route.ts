import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Invite from "@/lib/models/Invite"
import { rateLimiter } from "@/lib/ratelimit"
import { z } from "zod"

const responseSchema = z.object({
  inviteId: z.string().nonempty(),
  response: z.enum(["Yes", "No", "Maybe"]),
  responderId: z.string().nonempty(),
})

export async function POST(req: Request) {
  try {
    await dbConnect()

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    const { success } = await rateLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await req.json()

    // Input validation
    const validationResult = responseSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: "Invalid input data" }, { status: 400 })
    }

    const { inviteId, response, responderId } = validationResult.data

    const invite = await Invite.findById(inviteId)
    if (!invite) {
      return NextResponse.json({ success: false, error: "Invite not found" }, { status: 404 })
    }

    // Ensure respondedBy and responses are arrays
    invite.respondedBy = Array.isArray(invite.respondedBy) ? invite.respondedBy : []
    invite.responses = Array.isArray(invite.responses) ? invite.responses : []

    // Check if the user has already responded
    if (invite.respondedBy.some((id: string) => id.toString() === responderId)) {
      return NextResponse.json({ success: false, error: "You have already responded to this invite" }, { status: 400 })
    }

    // Update the invite with the new response
    invite.responses.push(response)
    invite.respondedBy.push(responderId)
    await invite.save()

    return NextResponse.json({
      success: true,
      message: "Response recorded successfully",
    })
  } catch (error) {
    console.error("Error updating invite:", error)
    return NextResponse.json({ success: false, error: "Failed to update invite" }, { status: 500 })
  }
}

