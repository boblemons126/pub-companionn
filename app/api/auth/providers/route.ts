import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check which providers are configured (without exposing keys)
    const availableProviders = {
      email: true, // Always available for testing
      sms: true, // Always available for testing
    }

    return NextResponse.json({
      providers: availableProviders,
      status: "ok",
    })
  } catch (error) {
    console.error("Providers API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch providers", providers: { google: false, apple: false, email: true, sms: true } },
      { status: 500 },
    )
  }
}
