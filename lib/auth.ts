import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    // Email Verification
    CredentialsProvider({
      id: "email-verification",
      name: "Email Verification",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null

        try {
          // Find verification code
          const verification = await prisma.verificationCode.findFirst({
            where: {
              email: credentials.email,
              code: credentials.code,
              isUsed: false,
              expiresAt: { gt: new Date() },
            },
          })

          if (!verification) return null

          // Mark code as used
          await prisma.verificationCode.update({
            where: { id: verification.id },
            data: { isUsed: true },
          })

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: "User",
                authProvider: "email",
                authProviderId: credentials.email,
                isVerified: true,
              },
            })
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatarUrl,
          }
        } catch (error) {
          console.error("Email auth error:", error)
          return null
        }
      },
    }),

    // Phone Verification
    CredentialsProvider({
      id: "phone-verification",
      name: "Phone Verification",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null

        try {
          // Find verification code
          const verification = await prisma.verificationCode.findFirst({
            where: {
              phone: credentials.phone,
              code: credentials.code,
              isUsed: false,
              expiresAt: { gt: new Date() },
            },
          })

          if (!verification) return null

          // Mark code as used
          await prisma.verificationCode.update({
            where: { id: verification.id },
            data: { isUsed: true },
          })

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone: credentials.phone,
                name: "User",
                authProvider: "phone",
                authProviderId: credentials.phone,
                isVerified: true,
              },
            })
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.avatarUrl,
          }
        } catch (error) {
          console.error("Phone auth error:", error)
          return null
        }
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