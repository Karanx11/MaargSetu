import { useState } from "react"

export default function Signup({ goToLogin }) {
  const [role, setRole] = useState("customer")

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      
      <div className="
        w-[90%] max-w-md
        bg-white/5
        backdrop-blur-lg
        border border-white/10
        rounded-2xl
        p-8
        shadow-2xl
      ">
        
        <h2 className="text-2xl font-bold text-[#4CBB17] text-center">
          Create Account
        </h2>

        <div className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CBB17]"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CBB17]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CBB17]"
          />

          {/* Role Selection */}
          <div className="flex gap-4 mt-4">
            
            <button
              onClick={() => setRole("driver")}
              className={`flex-1 py-3 rounded-xl border transition ${
                role === "driver"
                  ? "border-[#4CBB17] bg-[#4CBB17]/20"
                  : "border-white/20 bg-black/40"
              }`}
            >
              🚕 Driver
            </button>

            <button
              onClick={() => setRole("customer")}
              className={`flex-1 py-3 rounded-xl border transition ${
                role === "customer"
                  ? "border-[#4CBB17] bg-[#4CBB17]/20"
                  : "border-white/20 bg-black/40"
              }`}
            >
              🙋 Customer
            </button>

          </div>

          <button className="w-full py-3 rounded-xl bg-[#4CBB17] text-black font-semibold hover:scale-105 transition-all duration-300">
            Sign Up
          </button>

          <p
            onClick={goToLogin}
            className="text-center text-gray-400 text-sm mt-3 cursor-pointer hover:text-white"
          >
            Already have an account? Login
          </p>

        </div>

      </div>
    </div>
  )
}
