import { useState, useEffect } from "react"
import Login from "./screens/Login"
import MapScreen from "./screens/MapScreen"
import OtpSignup from "./screens/OtpSignup"
import ForgotPassword from "./screens/ForgotPassword"

export default function App() {
  const [screen, setScreen] = useState("login")
  const [role, setRole] = useState(null)

  // 🔐 Auto-login if token exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser)
      setRole(user.role)
      setScreen("map")
    }
  }, [])

  return (
    <>
      {/* LOGIN */}
      {screen === "login" && (
        <Login
          goToSignup={() => setScreen("signupOtp")}
          goToForgotPassword={() => setScreen("forgotPassword")}
          goToMap={(userRole) => {
            setRole(userRole)
            setScreen("map")
          }}
        />
      )}

      {/* OTP SIGNUP */}
      {screen === "signupOtp" && (
        <OtpSignup goToLogin={() => setScreen("login")} />
      )}

      {/* FORGOT PASSWORD */}
      {screen === "forgotPassword" && (
        <ForgotPassword goToLogin={() => setScreen("login")} />
      )}

      {/* MAP */}
      {screen === "map" && <MapScreen role={role} />}
    </>
  )
}