import { useState } from "react"
import api from "../services/api"

export default function Login({
  goToSignup,
  goToForgotPassword,
  goToMap,
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, user } = res.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      goToMap(user.role)
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-[#4CBB17] text-center">
          Login to MaargSetu
        </h2>

        <div className="mt-6 space-y-4">

          {/* Email */}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-[#4CBB17] text-black font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password */}
          <p
            onClick={goToForgotPassword}
            className="text-center text-sm text-gray-400 cursor-pointer hover:text-white"
          >
            Forgot Password?
          </p>

          {/* Signup */}
          <p
            onClick={goToSignup}
            className="text-center text-gray-400 text-sm cursor-pointer"
          >
            Don't have an account? Sign Up
          </p>

        </div>
      </div>
    </div>
  )
}