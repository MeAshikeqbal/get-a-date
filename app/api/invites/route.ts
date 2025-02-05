import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Invite from "@/lib/models/Invite"
import { generatePoem } from "@/lib/openai"
import { sendInviteEmail } from "@/lib/emailService"
import { rateLimiter } from "@/lib/ratelimit"
import { nanoid } from "nanoid"
import { z } from "zod"

const inviteSchema = z.object({
  senderName: z.string().nonempty(),
  senderEmail: z.string().email(),
  recipientName: z.string().nonempty(),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().nonempty(),
  isAnonymous: z.boolean(),
  theme: z.enum(["romantic", "funny", "mysterious"]),
  gif: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    await dbConnect()

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    const { success } = await rateLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await req.json()

    // Input validation using Zod schema
    const validationResult = inviteSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { senderName, senderEmail, recipientName, recipientEmail, message, isAnonymous, theme, gif } =
      validationResult.data

    const poem = await generatePoem(recipientName, recipientEmail || "")
    const inviteLink = nanoid(10)

    const invite = new Invite({
      senderName,
      senderEmail,
      recipientName,
      ...(recipientEmail && { recipientEmail }),
      message,
      isAnonymous,
      theme,
      gif,
      poem,
      link: inviteLink,
    })

    // Send email notification only if recipientEmail is available and not empty
    let emailSent = false
    if (recipientEmail && recipientEmail.trim() !== "") {
      try {
        emailSent = await sendInviteEmail(recipientEmail, inviteLink, senderName, isAnonymous)
        invite.emailSent = emailSent
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // Continue with invite creation even if email fails
      }
    }

    await invite.save()

    return NextResponse.json({
      success: true,
      link: inviteLink,
      emailSent,
    })
  } catch (error) {
    console.error("Error creating invite:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid input data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to create invite" }, { status: 500 })
  }
}

