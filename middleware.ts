import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimiter } from "./lib/ratelimit"
import { verifyToken } from "./lib/jwt"

const WHITELISTED_IPS = ["localhost", "::1"]
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
const ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-API-Key"]

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

  try {
    // HTTPS enforcement
    if (enforceHttps(request)) {
      return NextResponse.redirect(`https://${request.url.split("//")[1]}`)
    }

    // IP whitelist check
    if (WHITELISTED_IPS.includes(ip)) {
      return NextResponse.next()
    }

    // Rate limiting
    if (!(await checkRateLimit(ip))) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }

    // Route-specific middleware
    const routeMiddleware = getRouteMiddleware(request)
    const middlewareResult = await routeMiddleware(request)
    if (middlewareResult) return middlewareResult

    // Input validation for POST requests
    if (request.method === "POST" && !isValidContentType(request)) {
      return new NextResponse("Invalid Content-Type", { status: 415 })
    }

    const response = NextResponse.next()
    addSecurityHeaders(response)
    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

function enforceHttps(request: NextRequest): boolean {
  return process.env.NODE_ENV === "production" && !request.url.startsWith("https://")
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const { success } = await rateLimiter.limit(ip)
  if (!success) {
    console.warn(`Rate limit exceeded for IP: ${ip}`)
    return false
  }
  return true
}

function getRouteMiddleware(request: NextRequest): (req: NextRequest) => Promise<NextResponse | undefined> {
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
    return adminRouteMiddleware
  }
  if (request.url.includes("/api/protected")) {
    return protectedRouteMiddleware
  }
  return async () => undefined
}

async function adminRouteMiddleware(request: NextRequest): Promise<NextResponse | undefined> {
  const apiKey = request.headers.get("X-API-Key")
  if (apiKey !== process.env.ADMIN_API_KEY) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    } else {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  }
}

async function protectedRouteMiddleware(request: NextRequest): Promise<NextResponse | undefined> {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  const isValid = await verifyToken(token)
  if (!isValid) {
    return new NextResponse("Invalid Token", { status: 403 })
  }
}

function isValidContentType(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type")
  return !!contentType && contentType.includes("application/json")
}

function addSecurityHeaders(response: NextResponse): void {
  // CORS headers
  response.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*")
  response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "))
  response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "))

  // Security headers
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';",
  )
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
}

