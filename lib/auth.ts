import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Simplified auth configuration to avoid database issues
export const authOptions: NextAuthOptions = {
  providers: [
    // Email Verification - simplified without database for now
    CredentialsProvider({
      id: "email-verification",
      name: "Email Verification",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null

        // For now, accept any 6-digit code for testing
        if (credentials.code.length === 6 && /^\d+$/.test(credentials.code)) {
          return {
            id: "temp-user",
            name: "Test User",
            email: credentials.email,
          }
        }

        return null
      },
    }),

    // Phone Verification - simplified
    CredentialsProvider({
      id: "phone-verification",
      name: "Phone Verification",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null

        // For now, accept any 6-digit code for testing
        if (credentials.code.length === 6 && /^\d+$/.test(credentials.code)) {
          return {
            id: "temp-user",
            name: "Test User",
            phone: credentials.phone,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        if ("phone" in user && user.phone) {
          token.phone = user.phone
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        if (token.phone) {
          session.user.phone = token.phone as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/setup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: process.env.NODE_ENV === "development",
}
