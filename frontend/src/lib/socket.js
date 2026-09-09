import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("[Socket.IO Client] Connected with ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.warn("[Socket.IO Client] Connection error:", err.message);
});

export default socket;
