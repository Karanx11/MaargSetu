import { useState } from "react"
import api from "../services/api"

export default function Profile({ goBack, onLogout }) {
  const storedUser = JSON.parse(localStorage.getItem("user"))

  const [name, setName] = useState(storedUser.name)
  const [email, setEmail] = useState(storedUser.email)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
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
    </div>
  )
}