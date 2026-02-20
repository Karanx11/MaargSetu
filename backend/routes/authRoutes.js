import express from "express"
import {
  requestSignupOtp,
  verifySignupOtp,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js"

const router = express.Router()

// 🔐 OTP Signup
router.post("/request-signup-otp", requestSignupOtp)
router.post("/verify-signup-otp", verifySignupOtp)

// 🔐 Login
router.post("/login", login)

// 🔁 Password Reset
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router