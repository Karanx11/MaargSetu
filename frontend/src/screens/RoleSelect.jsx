export default function RoleSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black">
      
      <div
        className="
          w-[92%] max-w-md
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-8
          shadow-[0_0_40px_rgba(0,0,0,0.6)]
        "
      >
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#4CBB17] text-center">
          Choose Your Role
        </h2>

        <p className="text-center text-gray-400 mt-2 text-sm">
          Select how you want to continue on MaargSetu
        </p>

        {/* Role Buttons */}
        <div className="mt-10 space-y-5">
          
          {/* Driver */}
          <button
            className="
              w-full
              flex items-center gap-4
              py-5 px-6
              rounded-2xl
              bg-white/5
              border border-white/15
              text-white
              hover:border-[#4CBB17]
              hover:bg-[#4CBB17]/10
              transition-all duration-300
              group
            "
          >
            <span className="text-2xl">🚕</span>
            <div className="text-left">
              <p className="text-lg font-semibold group-hover:text-[#4CBB17]">
                Driver
              </p>
              <p className="text-sm text-gray-400">
                Share location & accept rides
              </p>
            </div>
          </button>

          {/* Customer */}
          <button
            className="
              w-full
              flex items-center gap-4
              py-5 px-6
              rounded-2xl
              bg-white/5
              border border-white/15
              text-white
              hover:border-[#4CBB17]
              hover:bg-[#4CBB17]/10
              transition-all duration-300
              group
            "
          >
            <span className="text-2xl">🙋</span>
            <div className="text-left">
              <p className="text-lg font-semibold group-hover:text-[#4CBB17]">
                Customer
              </p>
              <p className="text-sm text-gray-400">
                Find nearby drivers easily
              </p>
            </div>
          </button>

        </div>
      </div>

    </div>
  )
}