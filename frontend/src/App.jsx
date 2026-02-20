import { useState } from "react"
import Login from "./screens/login"
import Signup from "./screens/Signup"
import MapScreen from "./screens/MapScreen"

export default function App() {
  const [screen, setScreen] = useState("login")
  const [role, setRole] = useState(null)

  return (
    <>
      {screen === "login" && (
        <Login
          goToSignup={() => setScreen("signup")}
          goToMap={(userRole) => {
            setRole(userRole)
            setScreen("map")
          }}
        />
      )}

      {screen === "signup" && (
        <Signup goToLogin={() => setScreen("login")} />
      )}

      {screen === "map" && <MapScreen role={role} />}
    </>
  )
}
