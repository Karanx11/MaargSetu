import { useState } from "react"
import api from "../services/api"

export default function Profile({ goBack, onLogout }) {
  const storedUser = JSON.parse(localStorage.getItem("user"))

  const [name, setName] = useState(storedUser.name)
  const [email, setEmail] = useState(storedUser.email)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleUpdate = async () => {
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

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure? This will permanently delete your account."
    )

    if (!confirm) return

    try {
      await api.delete("/user/delete")
      localStorage.clear()
      alert("Account deleted")
      onLogout()
    } catch (err) {
      alert("Delete failed")
    }
  }

  const confirmLogout = () => {
    localStorage.clear()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      
      {/* MAIN CARD */}
      <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl text-white">

        <h2 className="text-2xl font-bold text-[#4CBB17] text-center">
          Edit Profile
        </h2>

        <div className="mt-6 space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleUpdate}
            className="w-full py-3 bg-[#4CBB17] text-black rounded-xl"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-3 bg-yellow-500/90 text-black rounded-xl"
          >
            Logout
          </button>

          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-500 rounded-xl"
          >
            Delete Account
          </button>

          <button
            onClick={goBack}
            className="w-full py-3 border border-white/20 rounded-xl"
          >
            Back to Map
          </button>
        </div>
      </div>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="w-[85%] max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white text-center">
            
            <h3 className="text-lg font-semibold mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              You will be logged out from your account.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-white/20"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="flex-1 py-2 rounded-xl bg-red-500"
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