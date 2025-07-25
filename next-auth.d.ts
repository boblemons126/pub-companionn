import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    phone?: string
  }
} 