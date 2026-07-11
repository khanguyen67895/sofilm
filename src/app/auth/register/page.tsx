import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <h1 className="text-center text-2xl font-bold text-white">Đăng Ký</h1>
      <RegisterForm />
      <p className="text-center text-sm text-white/50">
        Đã có tài khoản?{" "}
        <Link href={ROUTES.login} className="text-red-500 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
