import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Invite from "@/lib/models/Invite"

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await context.params

    const apiKey = req.headers.get("X-API-Key")
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const deletedInvite = await Invite.findByIdAndDelete(id)

    if (!deletedInvite) {
      return NextResponse.json({ success: false, error: "Invite not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Invite deleted successfully" })
  } catch (error) {
    console.error("Error deleting invite:", error)
    return NextResponse.json({ success: false, error: "Failed to delete invite" }, { status: 500 })
  }
}

