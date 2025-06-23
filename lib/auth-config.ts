import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./db"

// All API keys stay on the server - never exposed to frontend
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth - credentials only on server
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),

    // Apple Sign-In - credentials only on server
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET,
          }),
        ]
      : []),

    // Email Verification - backend only
    CredentialsProvider({
      id: "email-verification",
      name: "Email Verification",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null

        // All database operations happen on server
        const verification = await prisma.verificationCode.findFirst({
          where: {
            email: credentials.email,
            code: credentials.code,
            isUsed: false,
            expiresAt: { gt: new Date() },
          },
        })

        if (!verification) return null

        await prisma.verificationCode.update({
          where: { id: verification.id },
          data: { isUsed: true },
        })

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
      },
    }),

    // Phone Verification - backend only
    CredentialsProvider({
      id: "phone-verification",
      name: "Phone Verification",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null

        const verification = await prisma.verificationCode.findFirst({
          where: {
            phone: credentials.phone,
            code: credentials.code,
            isUsed: false,
            expiresAt: { gt: new Date() },
          },
        })

        if (!verification) return null

        await prisma.verificationCode.update({
          where: { id: verification.id },
          data: { isUsed: true },
        })

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
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.phone = token.phone as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "apple") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "User",
                avatarUrl: user.image,
                authProvider: account.provider,
                authProviderId: account.providerAccountId,
                isVerified: true,
              },
            })
          }
        } catch (error) {
          console.error("OAuth sign-in error:", error)
          return false
        }
      }
      return true
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
  secret: process.env.NEXTAUTH_SECRET,
}
