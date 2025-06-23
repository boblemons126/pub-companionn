import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Add error handling
const handler = async (req: Request, context: any) => {
  try {
    return await NextAuth(req, context, authOptions)
  } catch (error) {
    console.error("NextAuth error:", error)
    return new Response(JSON.stringify({ error: "Authentication service error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export { handler as GET, handler as POST }
