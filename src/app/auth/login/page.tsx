import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <h1 className="text-center text-2xl font-bold text-white">Đăng Nhập</h1>
      <LoginForm />
      <p className="text-center text-sm text-white/50">
        Chưa có tài khoản?{" "}
        <Link href={ROUTES.register} className="text-red-500 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
