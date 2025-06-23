"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/useAuth"
import { CheckCircle, Smartphone, Mail } from "lucide-react"

export default function RealAuthSetup() {
  const router = useRouter()
  const { signInWithEmail, signInWithPhone, signInWithGoogle, signInWithApple, sendEmailCode, sendSMSCode, isLoading } =
    useAuth()

  const [authMethod, setAuthMethod] = useState<"email" | "phone" | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [error, setError] = useState("")

  // Real Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // NextAuth will handle the redirect
    } catch (error) {
      setError("Google sign-in failed")
    }
  }

  // Real Apple Sign-In
  const handleAppleSignIn = async () => {
    try {
      await signInWithApple()
      // NextAuth will handle the redirect
    } catch (error) {
      setError("Apple sign-in failed")
    }
  }

  // Real Email Verification
  const handleSendEmailCode = async () => {
    if (!email.trim()) return

    const result = await sendEmailCode(email)
    if (result.success) {
      setShowVerification(true)
      setAuthMethod("email")
    } else {
      setError(result.error)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) return

    const result = await signInWithEmail(email, verificationCode)
    if (result.success) {
      router.push("/dashboard") // Redirect after successful sign-in
    } else {
      setError("Invalid verification code")
    }
  }

  // Real Phone Verification
  const handleSendSMSCode = async () => {
    if (!phone.trim()) return

    const result = await sendSMSCode(phone)
    if (result.success) {
      setShowVerification(true)
      setAuthMethod("phone")
      // In development, show the code
      if (result.code) {
        console.log("📱 SMS Code:", result.code)
      }
    } else {
      setError(result.error)
    }
  }

  const handleVerifyPhone = async () => {
    if (!verificationCode.trim()) return

    const result = await signInWithPhone(phone, verificationCode)
    if (result.success) {
      router.push("/dashboard") // Redirect after successful sign-in
    } else {
      setError("Invalid verification code")
    }
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur border-white/20 w-full max-w-md">
          <CardHeader className="text-center">
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

            <Button
              onClick={() => {
                setShowVerification(false)
                setAuthMethod(null)
                setVerificationCode("")
                setError("")
              }}
              variant="ghost"
              className="w-full text-blue-400 hover:text-blue-300"
            >
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

          {/* Google Sign-In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Apple Sign-In */}
          <Button
            onClick={handleAppleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-black hover:bg-gray-900 text-white"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Continue with Apple
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-400">Or</span>
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
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
        </CardContent>
      </Card>
    </div>
  )
}
