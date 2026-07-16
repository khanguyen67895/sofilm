import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import { AuthShell } from "@/features/auth/components/auth-shell";

export default function AdminLoginPage() {
  return (
    <AuthShell>
      <AdminLoginForm />
    </AuthShell>
  );
}
