import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

const app = express()
app.use(cors())
app.use(express.json())

// Create HTTP server
const server = http.createServer(app)

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

// Temporary in-memory storage
let users = {}

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id)

  socket.on("location:update", (data) => {
    users[socket.id] = data
    console.log("📍 Location received:", data)

    io.emit("users:update", Object.values(users))
  })

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id)
    delete users[socket.id]
    io.emit("users:update", Object.values(users))
  })
})

app.get("/", (req, res) => {
  res.send("MaargSetu Backend Running 🚀")
})

const PORT = 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
