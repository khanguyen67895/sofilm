"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessages } from "@/utils/api-error";
import { useLogin } from "../hooks/use-login";

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

/** Admin variant of email/password login — same underlying useLogin()/POST
 * /auth/login as the public EmailLoginForm, same visual language (AuthShell,
 * pill inputs, inline field errors), different copy and redirect target. */
export function AdminLoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = "Vui lòng nhập email hoặc tên đăng nhập.";
    if (!password) next.password = "Vui lòng nhập mật khẩu.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    login.mutate(
      { email, password },
      {
        onSuccess: () => router.push(ROUTES.adminMovies),
        onError: (err) => setErrors({ general: getApiErrorMessages(err).join(" ") }),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl leading-snug font-bold text-white sm:text-2xl">
          Admin <span className="text-brand">Đăng Nhập</span>
        </h1>
        <p className="text-base text-[#CCCCCC]">Đăng nhập để quản lý nội dung SoFilm.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label required>Email hoặc tên đăng nhập</Label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
            />
            <Input
              type="text"
              autoComplete="username"
              placeholder="Nhập email hoặc tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full pl-10"
              aria-invalid={Boolean(errors.email)}
              required
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 pl-1 text-xs text-red-500"
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Label required>Mật khẩu</Label>
          <PasswordInput
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            required
          />
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 pl-1 text-xs text-red-500"
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {errors.general && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500"
            >
              {errors.general}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" className="h-12 w-full" disabled={login.isPending}>
          {login.isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>
      </form>
    </div>
  );
}
