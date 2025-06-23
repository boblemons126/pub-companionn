"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Smartphone, Mail, ArrowLeft } from "lucide-react"
import { AuthProvider } from "@/components/auth-provider"

interface AuthProviders {
  google: boolean
  apple: boolean
  email: boolean
  sms: boolean
}

function SetupContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<AuthProviders>({
    google: false,
    apple: false,
    email: true,
    sms: true,
  })

  const [authMethod, setAuthMethod] = useState<"email" | "phone" | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [error, setError] = useState("")

  // Fetch available providers
  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) {
          setAvailableProviders(data.providers)
        }
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

      if (result?.ok) {
        router.push("/")
        return { success: true }
      }

      throw new Error("Sign in failed")
    } catch (error: any) {
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

      if (result?.ok) {
        router.push("/")
        return { success: true }
      }

      throw new Error("Sign in failed")
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmailCode = async (email: string) => {
    try {
      const response = await fetch("/api/auth/send-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      return data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const sendSMSCode = async (phone: string) => {
    try {
      const response = await fetch("/api/auth/send-sms-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()
      return data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const handleSendEmailCode = async () => {
    if (!email.trim()) return

    const result = await sendEmailCode(email)
    if (result.success) {
      setShowVerification(true)
      setAuthMethod("email")
      setError("")
      if (result.devCode) {
        console.log("📧 Email Code (DEV):", result.devCode)
      }
    } else {
      setError(result.error)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) return

    const result = await signInWithEmail(email, verificationCode)
    if (!result.success) {
      setError("Invalid verification code")
    }
  }

  const handleSendSMSCode = async () => {
    if (!phone.trim()) return

    const result = await sendSMSCode(phone)
    if (result.success) {
      setShowVerification(true)
      setAuthMethod("phone")
      setError("")
      if (result.devCode) {
        console.log("📱 SMS Code (DEV):", result.devCode)
      }
    } else {
      setError(result.error)
    }
  }

  const handleVerifyPhone = async () => {
    if (!verificationCode.trim()) return

    const result = await signInWithPhone(phone, verificationCode)
    if (!result.success) {
      setError("Invalid verification code")
    }
  }

  const resetForm = () => {
    setShowVerification(false)
    setAuthMethod(null)
    setVerificationCode("")
    setError("")
    setEmail("")
    setPhone("")
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur border-white/20 w-full max-w-md">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
              className="absolute top-4 left-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {authMethod === "email" ? (
              <Mail className="h-12 w-12 mx-auto mb-4 text-blue-400" />
            ) : (
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-green-400" />
            )}
            <CardTitle className="text-2xl">Verify Your {authMethod === "email" ? "Email" : "Phone"}</CardTitle>
            <CardDescription className="text-gray-300">
              Enter the verification code sent to{" "}
              <span className="font-medium">{authMethod === "email" ? email : phone}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">{error}</div>
            )}

            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="bg-white/10 border-white/20 text-white text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <Button
              onClick={authMethod === "email" ? handleVerifyEmail : handleVerifyPhone}
              disabled={verificationCode.length !== 6 || isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <Button onClick={resetForm} variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
              Use different {authMethod === "email" ? "email" : "phone number"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur border-white/20 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🍻</div>
          <CardTitle className="text-3xl">Welcome to Pub Companion!</CardTitle>
          <CardDescription className="text-gray-300">Sign in to start tracking your nights out</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">{error}</div>
          )}

          {/* Email */}
          {availableProviders.email && (
            <div className="space-y-3">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-white/10 border-white/20 text-white"
              />
              <Button
                onClick={handleSendEmailCode}
                disabled={!email.trim() || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Email
              </Button>
            </div>
          )}

          {/* Phone */}
          {availableProviders.sms && (
            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7123 456789"
                className="bg-white/10 border-white/20 text-white"
              />
              <Button
                onClick={handleSendSMSCode}
                disabled={!phone.trim() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Continue with Phone
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Setup() {
  return (
    <AuthProvider>
      <SetupContent />
    </AuthProvider>
  )
}
