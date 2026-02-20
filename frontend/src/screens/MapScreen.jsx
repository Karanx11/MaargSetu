import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import Profile from "./Profile"
import { socket } from "../services/socket"

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function MapScreen({ role = "driver" }) {
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [nearbyUsers, setNearbyUsers] = useState([])

  // ✅ GPS Tracking
  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ])
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  // ✅ Socket Connection + Listen Users
  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id)
    })

    socket.on("users:update", (users) => {
      setNearbyUsers(users)
      console.log("👥 Users received:", users)
    })

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected")
    })

    return () => {
      socket.off("users:update")
      socket.disconnect()
    }
  }, [])

  // ✅ Emit location every 5 sec when active
  useEffect(() => {
    if (!active || !position) return

    const interval = setInterval(() => {
      const payload = {
        role,
        latitude: position[0],
        longitude: position[1],
        socketId: socket.id,
      }

      socket.emit("location:update", payload)
      console.log("📡 Location sent:", payload)
    }, 5000)

    return () => clearInterval(interval)
  }, [active, position, role])

  // 👤 Profile Screen
  if (showProfile) {
    return (
      <Profile
        user={{
          name: "Demo User",
          email: "demo@maargsetu.com",
          role,
        }}
        goBack={() => setShowProfile(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-black/60 backdrop-blur-md border-b border-white/10 z-[1000]">
        <h1 className="text-lg font-bold text-[#4CBB17]">
          MaargSetu
        </h1>

        <button
          onClick={() => setShowProfile(true)}
          className="text-sm text-gray-400 border border-white/20 px-3 py-1 rounded-lg hover:bg-white/10 transition"
        >
          Profile
        </button>
      </div>

      {/* Map */}
      {position && (
        <MapContainer
          center={position}
          zoom={15}
          className="h-screen w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Your marker */}
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Other users */}
          {nearbyUsers
            .filter((user) => user.socketId !== socket.id)
            .map((user, index) => (
              <Marker
                key={index}
                position={[user.latitude, user.longitude]}
              >
                <Popup>
                  {user.role === "driver"
                    ? "🚕 Driver"
                    : "🙋 Customer"}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-white/5 backdrop-blur-lg border-t border-white/10 rounded-t-2xl z-[1000]">
        <button
          onClick={() => setActive(!active)}
          className={`w-full py-4 rounded-xl font-semibold transition ${
            active
              ? "bg-[#4CBB17] text-black"
              : "bg-black/40 border border-white/20"
          }`}
        >
          {role === "driver"
            ? active
              ? "Visible to Customers"
              : "Make Me Visible"
            : active
              ? "Searching for Auto..."
              : "I Need Auto"}
        </button>
      </div>

    </div>
  )
}
