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
    if (!email) return setError("Email is required")

    try {
      setError("")
      setLoading(true)
      await api.post("/auth/forgot-password", { email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!otp || !newPassword)
      return setError("All fields are required")

    try {
      setError("")
      setLoading(true)
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      })
      alert("Password reset successful")
      goToLogin()
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 text-white">

        {/* Heading */}
        <h2 className="text-3xl font-semibold text-center mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          {step === 1
            ? "Enter your email to receive an OTP"
            : "Enter the OTP and set a new password"}
        </p>

        {/* Step 1 - Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4CBB17] transition-all"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-5 py-3 bg-[#4CBB17] hover:bg-[#3aa313] disabled:opacity-60 transition-all text-black font-semibold rounded-xl"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* Step 2 - OTP + New Password */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4CBB17] transition-all"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4CBB17] transition-all"
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full mt-6 py-3 bg-[#4CBB17] hover:bg-[#3aa313] disabled:opacity-60 transition-all text-black font-semibold rounded-xl"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={goToLogin}
            className="text-sm text-gray-400 hover:text-[#4CBB17] transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}