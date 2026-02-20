import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
// socket code stays same 👇
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
})

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000")
})
