import twilio from "twilio"
import { config, isTwilioConfigured } from "./config"

// Initialize Twilio only if configured
let twilioClient: ReturnType<typeof twilio> | null = null

if (isTwilioConfigured()) {
  twilioClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
} else {
  console.warn("⚠️ Twilio not configured - SMS features will be disabled")
}

export async function sendVerificationSMS(to: string, code: string) {
  // Check if Twilio is configured
  if (!twilioClient) {
    console.error("❌ Cannot send SMS - Twilio not configured")
    return {
      success: false,
      error: "SMS service not configured. Please add Twilio credentials to environment variables.",
    }
  }

  try {
    const message = await twilioClient.messages.create({
      body: `Your Pub Companion verification code is: ${code}. Valid for 10 minutes.`,
      from: config.TWILIO_PHONE_NUMBER,
      to: to,
    })

    console.log(`✅ SMS sent successfully: ${message.sid}`)
    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error("❌ SMS sending failed:", error)
    return { success: false, error: error.message }
  }
}

// Mock SMS service for development/testing
export async function sendMockVerificationSMS(to: string, code: string) {
  console.log("📱 MOCK SMS SERVICE")
  console.log(`To: ${to}`)
  console.log(`Message: Your Pub Companion verification code is: ${code}. Valid for 10 minutes.`)
  console.log("✅ Mock SMS sent successfully")

  return { success: true, messageId: `mock_sms_${Date.now()}` }
}

// Smart SMS service that falls back to mock if not configured
export async function sendVerificationSMSSmart(to: string, code: string) {
  if (isTwilioConfigured()) {
    return sendVerificationSMS(to, code)
  } else {
    console.warn("⚠️ Using mock SMS service - configure Twilio credentials for real SMS")
    return sendMockVerificationSMS(to, code)
  }
}
