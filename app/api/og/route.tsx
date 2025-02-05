import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "Get a date"

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FDF2F8",
        fontSize: 60,
        fontWeight: "bold",
        color: "#DB2777",
      }}
    >
      <img src={`${process.env.NEXT_PUBLIC_APP_URL}/web-app-manifest-512x512.png`} alt="Get a date logo" width="200" height="200" />
      <div style={{ marginTop: 40 }}>{title}</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}

