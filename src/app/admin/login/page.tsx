import { AdminLoginForm } from "@/features/auth/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-24">
      <h1 className="text-center text-2xl font-bold text-white">Admin Đăng Nhập</h1>
      <AdminLoginForm />
    </div>
  );
}
