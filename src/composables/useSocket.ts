// src/composables/useSocket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let unloadHandlersAttached = false;

function attachUnloadHandlers() {
  if (unloadHandlersAttached) return;
  unloadHandlersAttached = true;

  const cleanup = () => {
    try { socket?.disconnect(); } catch {}
  };

  window.addEventListener("beforeunload", cleanup);

  window.addEventListener("pagehide", cleanup);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      setTimeout(() => {
        if (document.visibilityState !== "visible") cleanup();
      }, 120_000);
    }
  });
}

export function connectSocket(token: string, userId: number | string) {
  if (socket?.connected) return socket;

  socket = io("http://localhost:5002", {
    transports: ["websocket"],
    autoConnect: true,
    auth: { token },
    query: { user_id: String(userId) },
  });

  socket.on("connect", () => {
    console.log("[socket] conectado:", socket?.id);
    attachUnloadHandlers(); // <-- garante cleanup no fechar a página
  });

  socket.on("connect_error", (err) =>
    console.error("[socket] connect_error:", err?.message),
  );

  socket.on("disconnect", (reason) =>
    console.log("[socket] disconnect:", reason),
  );

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
