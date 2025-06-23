import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export const runtime = "nodejs"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/setup", request.url))
  }

  // Log configuration status on startup (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("🚀 Pub Companion Backend Starting...")

    // Import and log config status
    import("./lib/config").then(({ logConfigStatus }) => {
      logConfigStatus()
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
