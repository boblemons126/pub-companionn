import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function sendPhoneOTP(phone: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
      options: {
        channel: "sms",
      },
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("SMS sending failed:", error)
    return { success: false, error: error.message }
  }
}

export async function verifyPhoneOTP(phone: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: "sms",
    })

    if (error) throw error

    return { success: true, user: data.user }
  } catch (error) {
    console.error("OTP verification failed:", error)
    return { success: false, error: error.message }
  }
}
