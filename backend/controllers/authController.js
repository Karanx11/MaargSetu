import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import generateOtp from "../utils/generateOtp.js"
import sendEmail from "../utils/sendEmail.js"

//
// ================= SIGNUP WITH OTP =================
//

// 1️⃣ Request OTP
export const requestSignupOtp = async (req, res) => {
  try {
    const { email } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser && existingUser.password) {
      return res.status(400).json({ message: "User already exists" })
    }

    const otp = generateOtp()

    await User.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
      },
      { upsert: true, new: true }
    )

    await sendEmail(
      email,
      "MaargSetu Signup OTP",
      `Your OTP is ${otp}. Valid for 5 minutes.`
    )

    res.json({ message: "OTP sent to email" })
  } catch (error) {
    console.error("REQUEST SIGNUP OTP ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

// 2️⃣ Verify OTP & Create Account
export const verifySignupOtp = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body

    const user = await User.findOne({ email })

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.name = name
    user.role = role
    user.password = await bcrypt.hash(password, 10)
    user.otp = null
    user.otpExpires = null

    await user.save()

    res.json({ message: "Signup completed successfully" })
  } catch (error) {
    console.error("VERIFY SIGNUP OTP ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

//
// ================= LOGIN =================
//
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    res.status(500).json({ message: "Login failed" })
  }
}

//
// ================= FORGOT / RESET PASSWORD =================
//
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const otp = generateOtp()
    user.otp = otp
    user.otpExpires = Date.now() + 5 * 60 * 1000
    await user.save()

    await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`)

    res.json({ message: "OTP sent" })
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email })

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.otp = null
    user.otpExpires = null
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}