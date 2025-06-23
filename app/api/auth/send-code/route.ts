import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save verification code
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    })

    // For development: Just log the code (no actual SMS)
    console.log(`📱 SMS Code for ${phone}: ${code}`)

    // In production, you could integrate with any SMS service later
    // For now, return the code in development mode
    const response = {
      success: true,
      message: "Verification code sent",
      ...(process.env.NODE_ENV === "development" && { code }), // Only in dev
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Send code error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
