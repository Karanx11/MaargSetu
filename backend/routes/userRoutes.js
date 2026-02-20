import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { updateProfile } from "../controllers/userController.js"

const router = express.Router()

// ✏️ Update profile (name/email)
router.put("/update", authMiddleware, updateProfile)

export default router