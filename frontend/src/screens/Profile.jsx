import { useState } from "react"
import api from "../services/api"

export default function Profile({ goBack, onLogout }) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [name, setName] = useState(storedUser.name || "")
  const [email, setEmail] = useState(storedUser.email || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  /* ================= UPDATE PROFILE ================= */

  const handleUpdate = async () => {
    if (!name || !email) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.put("/user/update", { name, email })

      localStorage.setItem("user", JSON.stringify(res.data.user))

      alert("Profile updated successfully")
    } catch (err) {
      setError(err.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE ACCOUNT ================= */

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account."
    )

    if (!confirmDelete) return

    try {
      await api.delete("/user/delete")

      localStorage.clear()
      alert("Account deleted")

      onLogout()
    } catch (err) {
      alert("Delete failed")
    }
  }

  /* ================= LOGOUT ================= */

  const confirmLogout = () => {
    localStorage.clear()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center px-4 relative">

      {/* MAIN CARD */}

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-white">

        <h2 className="text-3xl font-semibold text-center text-[#4CBB17]">
          Edit Profile
        </h2>

        <p className="text-sm text-gray-400 text-center mt-1">
          Update your account information
        </p>

        <div className="mt-6 space-y-5">

          {/* NAME */}

          <div>
            <label className="text-sm text-gray-300">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="text-sm text-gray-300">
              Email Address
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4CBB17]"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* SAVE */}

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full py-3 bg-[#4CBB17] hover:bg-[#3aa313] disabled:opacity-60 transition text-black font-semibold rounded-xl"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

          {/* LOGOUT */}

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition"
          >
            Logout
          </button>

          {/* DELETE */}

          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition"
          >
            Delete Account
          </button>

          {/* BACK */}

          <button
            onClick={goBack}
            className="w-full py-3 border border-white/20 hover:bg-white/10 rounded-xl transition"
          >
            Back to Map
          </button>
        </div>
      </div>

      {/* LOGOUT MODAL */}

      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white text-center shadow-lg">

            <h3 className="text-lg font-semibold mb-2">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-300 mb-6">
              You will be logged out from your account.
            </p>

            <div className="flex gap-4">

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}