export default function Profile({ user, goBack }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      
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
          Profile
        </h2>

        <div className="mt-6 space-y-4">
          
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Role</p>
            <p className="font-semibold capitalize text-[#4CBB17]">
              {user.role}
            </p>
          </div>

          <button
            className="w-full py-3 rounded-xl bg-red-500/80 hover:bg-red-500 transition font-semibold"
          >
            Logout
          </button>

          <button
            onClick={goBack}
            className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Back to Map
          </button>

        </div>

      </div>

    </div>
  )
}
