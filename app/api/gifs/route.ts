import { NextResponse } from "next/server"

const GIPHY_API_KEY = process.env.GIPHY_API_KEY

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=9`)
    const data = await response.json()
    interface Gif {
      images: {
        fixed_height: {
          url: string
        }
      }
    }

    const gifs = data.data.map((gif: Gif) => gif.images.fixed_height.url)

    return NextResponse.json({ gifs })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch GIFs" }, { status: 500 })
  }
}

