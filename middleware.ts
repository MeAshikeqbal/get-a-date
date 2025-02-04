import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimiter } from "./lib/ratelimit"
import { verifyToken } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

  // HTTPS enforcement
  if (process.env.NODE_ENV === "production" && !request.url.startsWith("https://")) {
    return NextResponse.redirect(`https://${request.url.split("//")[1]}`)
  }

  try {
    // Rate limiting
    const { success } = await rateLimiter.limit(ip)
    if (!success) {
      console.warn(`Rate limit exceeded for IP: ${ip}`)
      return new NextResponse("Too Many Requests", { status: 429 })
    }

    // JWT Authentication for protected routes
    if (request.url.includes("/api/protected")) {
      const token = request.headers.get("Authorization")?.split(" ")[1]
      if (!token) {
        return new NextResponse("Unauthorized", { status: 401 })
      }
      const isValid = await verifyToken(token)
      if (!isValid) {
        return new NextResponse("Invalid Token", { status: 403 })
      }
    }

    // Basic input validation
    if (request.method === "POST") {
      const contentType = request.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        return new NextResponse("Invalid Content-Type", { status: 415 })
      }
    }

    const response = NextResponse.next()

    // CORS headers
    response.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Security headers
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("Content-Security-Policy", "default-src 'self'")

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const config = {
  matcher: ["/api/:path*"],
}

