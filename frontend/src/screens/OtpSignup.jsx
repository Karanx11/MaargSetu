import { useState } from "react"
import api from "../services/api"

export default function OtpSignup({ goToLogin }) {
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("customer")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const sendOtp = async () => {
    try {
      setLoading(true)
      setError("")
      await api.post("/auth/request-signup-otp", { email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    try {
      setLoading(true)
      setError("")
      await api.post("/auth/verify-signup-otp", {
        name,
        email,
        password,
        role,
        otp,
      })
      alert("Account created successfully!")
      goToLogin()
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold text-[#4CBB17] text-center">
          Signup with OTP
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-6 rounded-xl bg-black/40 border border-white/10"
            />

            <button
              onClick={sendOtp}
              className="w-full mt-4 py-3 bg-[#4CBB17] text-black rounded-xl"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl bg-black/40 border border-white/10"
            />

            {/* Password with Show / Hide */}
            <div className="relative mt-4">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded-xl bg-black/40 border border-white/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl bg-black/40 border border-white/10"
            />

            {/* Role Selection */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setRole("driver")}
                className={`flex-1 py-2 rounded-xl ${
                  role === "driver"
                    ? "bg-[#4CBB17] text-black"
                    : "bg-white/10"
                }`}
              >
                Driver
              </button>

              <button
                onClick={() => setRole("customer")}
                className={`flex-1 py-2 rounded-xl ${
                  role === "customer"
                    ? "bg-[#4CBB17] text-black"
                    : "bg-white/10"
                }`}
              >
                Customer
              </button>
            </div>

            <button
              onClick={verifyOtp}
              className="w-full mt-6 py-3 bg-[#4CBB17] text-black rounded-xl"
            >
              {loading ? "Verifying..." : "Create Account"}
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