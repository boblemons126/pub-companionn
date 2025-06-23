import { NextResponse } from "next/server"
import { config, logConfigStatus, isResendConfigured, isTwilioConfigured, isGoogleOAuthConfigured } from "@/lib/config"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`

    // Log configuration status
    logConfigStatus()

    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      services: {
        database: "✅ Connected",
        email: isResendConfigured() ? "✅ Configured" : "⚠️ Not configured",
        sms: isTwilioConfigured() ? "✅ Configured" : "⚠️ Not configured",
        oauth: isGoogleOAuthConfigured() ? "✅ Configured" : "⚠️ Not configured",
      },
      features: {
        emailVerification: config.ENABLE_EMAIL_VERIFICATION,
        smsVerification: config.ENABLE_SMS_VERIFICATION,
        oauthLogin: config.ENABLE_OAUTH,
      },
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 },
    )
  }
}
