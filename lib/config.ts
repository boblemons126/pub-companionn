import { z } from "zod"

// Define the schema for environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("Invalid database URL").optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().url("Invalid NextAuth URL").optional(),
  NEXTAUTH_SECRET: z.string().min(32, "NextAuth secret must be at least 32 characters").optional(),

  // Email Service (Resend)
  RESEND_API_KEY: z.string().startsWith("re_", "Invalid Resend API key format").optional(),

  // SMS Service (Twilio) - for future use
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // File Storage
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Redis (for caching and rate limiting)
  REDIS_URL: z.string().url("Invalid Redis URL").optional(),

  // App Configuration
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("3000"),

  // Feature Flags
  ENABLE_SMS_VERIFICATION: z.string().transform(Boolean).default("false"),
  ENABLE_EMAIL_VERIFICATION: z.string().transform(Boolean).default("true"),
  ENABLE_OAUTH: z.string().transform(Boolean).default("true"),
})

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n")
      throw new Error(`❌ Invalid environment variables:\n${missingVars}`)
    }
    throw error
  }
}

// Export validated config
export const config = validateEnv()

// Helper functions to check if services are configured
export const isResendConfigured = () => Boolean(config.RESEND_API_KEY)
export const isTwilioConfigured = () => Boolean(config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN)
export const isRedisConfigured = () => Boolean(config.REDIS_URL)

// Log configuration status (without exposing secrets)
export function logConfigStatus() {
  console.log("🔧 Configuration Status:")
  console.log(`  Database: ${config.DATABASE_URL ? "✅ Connected" : "❌ Missing"}`)
  console.log(`  Resend Email: ${isResendConfigured() ? "✅ Configured" : "❌ Missing"}`)
  console.log(`  Twilio SMS: ${isTwilioConfigured() ? "✅ Configured" : "❌ Missing"}`)
  console.log(`  Redis Cache: ${isRedisConfigured() ? "✅ Configured" : "❌ Missing"}`)
  console.log(`  Environment: ${config.NODE_ENV}`)
}
