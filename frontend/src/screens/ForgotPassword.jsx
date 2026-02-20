import { useState } from "react"
import api from "../services/api"

export default function ForgotPassword({ goToLogin }) {
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const sendOtp = async () => {
    try {
      setLoading(true)
      await api.post("/auth/forgot-password", { email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    try {
      setLoading(true)
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      })
      alert("Password reset successful")
      goToLogin()
    } catch (err) {
      setError(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold text-[#4CBB17] text-center">
          Reset Password
        </h2>

        {step === 1 && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-6 p-3 rounded-xl bg-black/40 border border-white/10"
            />
            <button
              onClick={sendOtp}
              className="w-full mt-4 py-3 bg-[#4CBB17] text-black rounded-xl"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl bg-black/40 border border-white/10"
            />

            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl bg-black/40 border border-white/10"
            />

            <button
              onClick={resetPassword}
              className="w-full mt-6 py-3 bg-[#4CBB17] text-black rounded-xl"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}