// src/composables/useSocket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string, userId: number | string) {
  if (socket?.connected) return socket;

  socket = io("http://localhost:5002", {
    transports: ["websocket"],
    autoConnect: true,
    auth: { token },                          // mantém o JWT no handshake
    query: { user_id: String(userId) },       // <-- ESSENCIAL pro backend fazer join_room
  });

  socket.on("connect", () =>
    console.log("[socket] conectado:", socket?.id),
  );
  socket.on("connect_error", (err) =>
    console.error("[socket] connect_error:", err?.message),
  );

  // seus listeners existentes podem ficar aqui (ex. friends:new_request etc.)
  // socket.on("friends:new_request", (data) => console.log("NEW", data));
  // socket.on("friends:accepted", (data) => console.log("ACCEPT", data));

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
