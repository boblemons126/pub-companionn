"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"

interface AuthProviders {
  google: boolean
  apple: boolean
  email: boolean
  sms: boolean
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<AuthProviders>({
    google: false,
    apple: false,
    email: false,
    sms: false,
  })

  // Fetch available providers from backend (no API keys exposed)
  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data) => {
        setAvailableProviders(data.providers)
      })
      .catch((error) => {
        console.error("Failed to fetch auth providers:", error)
      })
  }, [])

  const signInWithEmail = async (email: string, code: string) => {
    setIsLoading(true)
    try {
      const result = await signIn("email-verification", {
        email,
        code,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithPhone = async (phone: string, code: string) => {
    setIsLoading(true)
    try {
      const result = await signIn("phone-verification", {
        phone,
        code,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!availableProviders.google) {
      return { success: false, error: "Google sign-in not configured" }
    }

    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
      return { success: true }
    } catch (error) {
      console.error("Google sign-in error:", error)
      return { success: false, error: "Google sign-in failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithApple = async () => {
    if (!availableProviders.apple) {
      return { success: false, error: "Apple sign-in not configured" }
    }

    setIsLoading(true)
    try {
      await signIn("apple", { callbackUrl: "/dashboard" })
      return { success: true }
    } catch (error) {
      console.error("Apple sign-in error:", error)
      return { success: false, error: "Apple sign-in failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Frontend calls backend API - no API keys in frontend
  const sendEmailCode = async (email: string) => {
    try {
      const response = await fetch("/api/auth/send-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Frontend calls backend API - no API keys in frontend
  const sendSMSCode = async (phone: string) => {
    try {
      const response = await fetch("/api/auth/send-sms-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading" || isLoading,
    availableProviders, // Frontend knows what's available without seeing API keys
    signInWithEmail,
    signInWithPhone,
    signInWithGoogle,
    signInWithApple,
    sendEmailCode,
    sendSMSCode,
    logout,
  }
}
