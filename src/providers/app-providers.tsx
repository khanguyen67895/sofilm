"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { SocketProvider } from "./socket-provider";
import { AuthQuerySync } from "./auth-query-sync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryProvider>
        <AuthQuerySync />
        <SocketProvider>{children}</SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
