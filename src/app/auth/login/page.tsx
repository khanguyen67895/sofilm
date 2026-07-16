import { AuthShell } from "@/features/auth/components/auth-shell";
import { EmailLoginForm } from "@/features/auth/components/email-login-form";

export default function LoginPage() {
  return (
    <AuthShell>
      <EmailLoginForm />
    </AuthShell>
  );
}
