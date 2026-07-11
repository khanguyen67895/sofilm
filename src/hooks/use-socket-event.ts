import { useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";

export function useSocketEvent<T = unknown>(
  event: string,
  handler: (payload: T) => void
) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
