require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);



const http = require("http");
const { Server } = require("socket.io");
const { testSupabaseConnection } = require("./config/supabase");
const supabaseRoutes = require("./routes/supabaseRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO Server Configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Join role-based room (teacher or student)
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`[Socket.IO] ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", supabaseRoutes);

server.listen(PORT, async () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
  const status = await testSupabaseConnection();
  if (status.success) {
    console.log(`✅ [Supabase] Connected to project at: ${status.url}`);
  } else {
    console.warn(`⚠️ [Supabase] Connection check note: ${status.message}`);
  }
});