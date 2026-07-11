import { io, type Socket } from "socket.io-client";
import { API_CONFIG, AUTH_TOKEN_KEY } from "@/constants/config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_CONFIG.socketURL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: (cb) => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem(AUTH_TOKEN_KEY)
            : null;
        cb({ token });
      },
    });
  }
  return socket;
}
