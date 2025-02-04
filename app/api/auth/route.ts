import { NextResponse } from "next/server"

const API_KEY = process.env.ADMIN_API_KEY

export async function POST(req: Request) {
  const { apiKey } = await req.json()

  if (apiKey === API_KEY) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}