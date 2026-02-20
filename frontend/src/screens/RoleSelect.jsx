export default function RoleSelect() {
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
          Select Your Role
        </h2>

        <p className="text-center text-gray-400 mt-2">
          Choose how you want to use MaargSetu
        </p>

        <div className="mt-8 space-y-4">
          
          {/* Driver */}
          <button className="
            w-full py-4 rounded-xl
            bg-black/40 border border-white/20
            text-white text-lg font-semibold
            hover:border-[#4CBB17]
            hover:bg-[#4CBB17]/10
            transition-all
          ">
            🚕 I am a Driver
          </button>

          {/* Customer */}
          <button className="
            w-full py-4 rounded-xl
            bg-black/40 border border-white/20
            text-white text-lg font-semibold
            hover:border-[#4CBB17]
            hover:bg-[#4CBB17]/10
            transition-all
          ">
            🙋 I am a Customer
          </button>

        </div>

      </div>

    </div>
  )
}
