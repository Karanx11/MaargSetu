export default function Login({ goToRoleSelect, goToSignup }) {

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
          Login to MaargSetu
        </h2>

        <div className="mt-6 space-y-4">
          
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

          <button
            onClick={goToRoleSelect}
            className="w-full py-3 rounded-xl bg-[#4CBB17] text-black font-semibold hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        <p
  onClick={goToSignup}
  className="text-center text-gray-400 text-sm mt-4 cursor-pointer hover:text-white"
>
  Don't have an account? Sign Up
</p>

          <button className="w-full py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            Continue with Google
          </button>

        </div>

      </div>
    </div>
  )
}
