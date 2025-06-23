"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle } from "lucide-react"

interface EmailVerificationProps {
  onSuccess: (userData: any) => void
  onBack: () => void
}

export function EmailVerification({ onSuccess, onBack }: EmailVerificationProps) {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sendEmailVerification = async () => {
    if (!email.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/send-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setShowVerification(true)
        console.log("✅ Verification email sent!")
      } else {
        alert(data.error || "Failed to send verification email")
      }
    } catch (error) {
      console.error("Send email error:", error)
      alert("Failed to send verification email")
    }
    setIsLoading(false)
  }

  const verifyEmailCode = async () => {
    if (!verificationCode.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/verify-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess({
          authMethod: "email",
          authId: email,
          email: email,
          name: data.user.name,
        })
      } else {
        alert(data.error || "Invalid verification code")
      }
    } catch (error) {
      console.error("Verify email error:", error)
      alert("Failed to verify code")
    }
    setIsLoading(false)
  }

  if (!showVerification) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-base">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-base mt-2"
          />
        </div>
        <Button
          onClick={sendEmailVerification}
          disabled={!email.trim() || isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending code...
            </div>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Send Verification Code
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-blue-400" />
        <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
        <p className="text-sm text-gray-300">
          We've sent a verification code to <br />
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <div>
        <Label htmlFor="verification-code" className="text-base">
          Verification Code
        </Label>
        <Input
          id="verification-code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-base text-center text-2xl tracking-widest mt-2"
          maxLength={6}
        />
      </div>

      <Button
        onClick={verifyEmailCode}
        disabled={verificationCode.length !== 6 || isLoading}
        className="w-full h-12 bg-green-600 hover:bg-green-700"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Verifying...
          </div>
        ) : (
          <>
            <CheckCircle className="w-5 w-5 mr-2" />
            Verify Email
          </>
        )}
      </Button>

      <Button onClick={onBack} variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
        Use a different email
      </Button>
    </div>
  )
}
