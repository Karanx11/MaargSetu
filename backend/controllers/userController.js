import User from "../models/User.js"

// ✏️ Update Profile (name + email)
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}