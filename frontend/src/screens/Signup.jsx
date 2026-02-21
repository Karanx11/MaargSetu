import { useState } from "react"
import api from "../services/api"

export default function Signup({ goToLogin }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("customer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async () => {
    try {
      setLoading(true)
      setError("")

      await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      })

      alert("Signup successful! Please login.")
      goToLogin()
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-[#4CBB17] text-center">
          Create Account
        </h2>

        <div className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white"
          />

          {/* Password with Show / Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 rounded-xl bg-black/40 border border-white/10 text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Role Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setRole("driver")}
              className={`flex-1 py-3 rounded-xl border ${
                role === "driver"
                  ? "border-[#4CBB17] bg-[#4CBB17]/20"
                  : "border-white/20"
              }`}
            >
              🚕 Driver
            </button>

            <button
              onClick={() => setRole("customer")}
              className={`flex-1 py-3 rounded-xl border ${
                role === "customer"
                  ? "border-[#4CBB17] bg-[#4CBB17]/20"
                  : "border-white/20"
              }`}
            >
              🙋 Customer
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleSignup}
            className="w-full py-3 rounded-xl bg-[#4CBB17] text-black font-semibold"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p
            onClick={goToLogin}
            className="text-center text-gray-400 text-sm cursor-pointer"
          >
            Already have an account? Login
          </p>

        </div>
      </div>
    </div>
  )
}