"use client";

import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { RouteFade } from "./route-fade";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Admin routes render their own persistent chrome (AdminSidebar/AdminHeader) via a
  // nested layout, and apply their own scoped RouteFade around just the page content
  // (see AdminLayout). Wrapping the whole subtree here too would key the sidebar/header
  // into this AnimatePresence and remount them on every admin navigation.
  if (pathname.startsWith(ROUTES.admin)) return <>{children}</>;

  return <RouteFade>{children}</RouteFade>;
}
