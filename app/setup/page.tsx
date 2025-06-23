"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Smartphone, Mail, ArrowLeft } from "lucide-react"

interface AuthProviders {
  google: boolean
  apple: boolean
  email: boolean
  sms: boolean
}

export default function Setup() {
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
  const [devCode, setDevCode] = useState("")

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession()
      if (session) {
        router.push("/")
      }
    }
    checkAuth()
  }, [router])

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

  const handleSendEmailCode = async () => {
    if (!email.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setShowVerification(true)
        setAuthMethod("email")
        if (data.devCode) {
          setDevCode(data.devCode)
          console.log("📧 Email Code (DEV):", data.devCode)
        }
      } else {
        setError(data.error || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Send email error:", error)
      setError("Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("email-verification", {
        email,
        code: verificationCode,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid verification code")
      } else if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      console.error("Verify email error:", error)
      setError("Failed to verify code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendSMSCode = async () => {
    if (!phone.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-sms-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (data.success) {
        setShowVerification(true)
        setAuthMethod("phone")
        if (data.devCode) {
          setDevCode(data.devCode)
          console.log("📱 SMS Code (DEV):", data.devCode)
        }
      } else {
        setError(data.error || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Send SMS error:", error)
      setError("Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyPhone = async () => {
    if (!verificationCode.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("phone-verification", {
        phone,
        code: verificationCode,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid verification code")
      } else if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      console.error("Verify phone error:", error)
      setError("Failed to verify code")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setShowVerification(false)
    setAuthMethod(null)
    setVerificationCode("")
    setError("")
    setEmail("")
    setPhone("")
    setDevCode("")
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
            {devCode && (
              <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-200 text-sm">
                <strong>DEV CODE:</strong> {devCode}
              </div>
            )}
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
                {isLoading && authMethod === "email" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Continue with Email
                  </>
                )}
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
                {isLoading && authMethod === "phone" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5 mr-2" />
                    Continue with Phone
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-gray-400 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  )
}