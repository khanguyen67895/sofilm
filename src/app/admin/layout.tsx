import type { ReactNode } from "react";
import { AdminGuard, AdminLayout } from "@/features/admin";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
