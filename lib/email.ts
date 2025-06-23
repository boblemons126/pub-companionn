import { Resend } from "resend"

// API key only exists on server - never exposed to frontend
let resend: Resend | null = null

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
} else {
  console.warn("⚠️ Resend not configured - email features will be disabled")
}

export async function sendVerificationEmail(to: string, code: string) {
  // Check if Resend is configured (server-side only)
  if (!resend) {
    console.error("❌ Cannot send email - Resend not configured")
    return {
      success: false,
      error: "Email service not configured. Please add RESEND_API_KEY to environment variables.",
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Pub Companion <onboarding@resend.dev>",
      to: [to],
      subject: "Your Pub Companion Verification Code 🍻",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🍻</div>
              <h1 style="color: #6366f1; margin: 0; font-size: 28px; font-weight: bold;">
                Pub Companion
              </h1>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">
                Your night out companion
              </p>
            </div>

            <!-- Main Content -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">
                Verify Your Email
              </h2>
              <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.5;">
                Enter this verification code to complete your account setup:
              </p>
              
              <!-- Verification Code -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; margin: 32px 0;">
                <div style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>

              <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 14px;">
                This code will expire in <strong>10 minutes</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 32px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                If you didn't request this code, please ignore this email.
              </p>
              <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                © 2024 Pub Companion. Ready for your next adventure!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    console.log("✅ Email sent successfully:", data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("❌ Email sending failed:", error)
    return { success: false, error: error.message }
  }
}

// Mock email service for development/testing
export async function sendMockVerificationEmail(to: string, code: string) {
  console.log("📧 MOCK EMAIL SERVICE")
  console.log(`To: ${to}`)
  console.log(`Subject: Your Pub Companion Verification Code 🍻`)
  console.log(`Code: ${code}`)
  console.log("✅ Mock email sent successfully")

  return { success: true, messageId: `mock_${Date.now()}` }
}

// Smart email service that falls back to mock if not configured
export async function sendVerificationEmailSmart(to: string, code: string) {
  if (process.env.RESEND_API_KEY) {
    return sendVerificationEmail(to, code)
  } else {
    console.warn("⚠️ Using mock email service - configure RESEND_API_KEY for real emails")
    return sendMockVerificationEmail(to, code)
  }
}
