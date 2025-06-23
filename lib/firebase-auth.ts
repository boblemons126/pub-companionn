import { initializeApp } from "firebase/app"
import { getAuth, type RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

const firebaseConfig = {
  // Your Firebase config
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export async function sendFirebaseOTP(phone: string, recaptchaVerifier: RecaptchaVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier)
    return { success: true, confirmationResult }
  } catch (error) {
    console.error("Firebase OTP failed:", error)
    return { success: false, error: error.message }
  }
}
