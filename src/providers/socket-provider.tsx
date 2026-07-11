"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket>(getSocket());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const socket = socketRef.current;
    if (isAuthenticated) socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
