import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = verifyEmailSchema.parse(body)

    // Find verification code
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    })

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { isUsed: true },
    })

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "User", // Will be updated in onboarding
          authProvider: "email",
          authProviderId: email,
          isVerified: true,
        },
      })
    } else {
      // Update verification status
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }

    console.error("Verify email code error:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}