import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const sendEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = sendEmailSchema.parse(body)

    // For testing - generate a simple code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // In development, always return success with the code
    console.log(`📧 Email verification code for ${email}: ${code}`)

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      // In development, return the code for testing
      ...(process.env.NODE_ENV === "development" && { devCode: code }),
    })
  } catch (error) {
    console.error("Send email code error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
