import { useState, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet"
import { useMap } from "react-leaflet"
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

// Custom Icons
const driverIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
})

const customerIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
})

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function MapScreen({ role = "driver" }) {
  const [position, setPosition] = useState(null)
  const [nearbyUsers, setNearbyUsers] = useState([])
  const [showProfile, setShowProfile] = useState(false)

  const [rideStatus, setRideStatus] = useState("idle")
  const [ridePartner, setRidePartner] = useState(null)
  const [incomingRequest, setIncomingRequest] = useState(null)

  // ================= GPS =================
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

  // ================= SOCKET =================
  useEffect(() => {
    socket.connect()

    socket.on("users:update", (users) => {
      setNearbyUsers(users)
    })

    socket.on("ride:request", (data) => {
      if (role === "driver") {
        setIncomingRequest(data)
      }
    })

    socket.on("ride:accept", (data) => {
      if (role === "customer") {
        setRidePartner({
          latitude: data.driverLocation[0],
          longitude: data.driverLocation[1],
        })
        setRideStatus("accepted")
      }
    })

    return () => socket.disconnect()
  }, [])

  // ================= EMIT LOCATION =================
  useEffect(() => {
    if (!position) return

    const interval = setInterval(() => {
      socket.emit("location:update", {
        role,
        latitude: position[0],
        longitude: position[1],
        socketId: socket.id,
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [position, role])

  // ================= PROFILE =================
  if (showProfile) {
  return (
    <Profile
      goBack={() => setShowProfile(false)}
      onLogout={() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.reload()
      }}
    />
  )
}

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-black/60 backdrop-blur-md z-[1000]">
        <h1 className="text-lg font-bold text-[#4CBB17]">
          MaargSetu
        </h1>
        <button
          onClick={() => setShowProfile(true)}
          className="text-sm border border-white/20 px-3 py-1 rounded-lg"
        >
          Profile
        </button>
      </div>

      {/* Incoming Request Modal */}
      {incomingRequest && role === "driver" && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[2000]">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <h3 className="text-[#4CBB17] font-semibold">
              Ride Request
            </h3>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  socket.emit("ride:accept", {
                    to: incomingRequest.from,
                    driverLocation: position,
                  })

                  setRidePartner({
                    latitude:
                      incomingRequest.customerLocation[0],
                    longitude:
                      incomingRequest.customerLocation[1],
                  })

                  setRideStatus("accepted")
                  setIncomingRequest(null)
                }}
                className="bg-[#4CBB17] text-black px-4 py-2 rounded-lg"
              >
                Accept
              </button>

              <button
                onClick={() => setIncomingRequest(null)}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

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

          {/* Self */}
          <Marker
            position={position}
            icon={
              role === "driver" ? driverIcon : customerIcon
            }
          >
            <Popup>You</Popup>
          </Marker>

          {/* Nearby Users */}
          {nearbyUsers
            .filter((u) => u.socketId !== socket.id)
            .map((user, index) => (
              <Marker
                key={index}
                position={[user.latitude, user.longitude]}
                icon={
                  user.role === "driver"
                    ? driverIcon
                    : customerIcon
                }
              >
                <Popup>
                  {user.role === "driver"
                    ? "🚕 Driver"
                    : "🙋 Customer"}

                  {role === "customer" &&
                    user.role === "driver" &&
                    rideStatus === "idle" && (
                      <button
                        onClick={() => {
                          socket.emit("ride:request", {
                            from: socket.id,
                            to: user.socketId,
                            customerLocation: position,
                          })
                          setRideStatus("requested")
                        }}
                        className="mt-2 bg-[#4CBB17] text-black px-3 py-1 rounded-lg text-sm"
                      >
                        Request Ride
                      </button>
                    )}
                </Popup>
              </Marker>
            ))}

          {/* Route After Accept */}
          {rideStatus !== "idle" &&
            ridePartner &&
            position && (
              <Polyline
                positions={[
                  position,
                  [
                    ridePartner.latitude,
                    ridePartner.longitude,
                  ],
                ]}
                pathOptions={{
                  color: "#4CBB17",
                  weight: 4,
                }}
              />
            )}
        </MapContainer>
      )}

      {/* Bottom Ride Status */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-white/5 backdrop-blur-lg z-[1000]">

        {rideStatus === "idle" && (
          <p className="text-center text-gray-400">
            Waiting...
          </p>
        )}

        {rideStatus === "requested" && (
          <p className="text-center text-yellow-400">
            🚕 Waiting for driver...
          </p>
        )}

        {rideStatus === "accepted" && (
          <button
            onClick={() => setRideStatus("ongoing")}
            className="w-full py-3 bg-[#4CBB17] text-black rounded-xl"
          >
            Start Ride
          </button>
        )}

        {rideStatus === "ongoing" && (
          <button
            onClick={() => setRideStatus("completed")}
            className="w-full py-3 bg-blue-500 rounded-xl"
          >
            Complete Ride
          </button>
        )}

        {rideStatus === "completed" && (
          <button
            onClick={() => {
              setRideStatus("idle")
              setRidePartner(null)
            }}
            className="w-full py-3 bg-gray-600 rounded-xl"
          >
            Ride Completed ✔
          </button>
        )}
      </div>
    </div>
  )
}
