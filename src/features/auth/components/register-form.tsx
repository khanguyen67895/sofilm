"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessages } from "@/utils/api-error";
import { useRegister } from "../hooks/use-register";

const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,32}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{9,15}$/;

interface FieldErrors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!USERNAME_PATTERN.test(username)) {
      next.username = "Tên đăng nhập phải dài 3-32 ký tự (chữ, số, _ hoặc .).";
    }
    if (!EMAIL_PATTERN.test(email)) {
      next.email = "Email không hợp lệ.";
    }
    if (!PHONE_PATTERN.test(phone)) {
      next.phone = "Số điện thoại không hợp lệ.";
    }
    if (password.length < 8) {
      next.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    if (confirmPassword !== password) {
      next.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /** Backend messages (validation errors or "X already registered/taken") name
   * the offending field in plain English, so route each one under its input
   * instead of dumping them all in one generic banner. */
  function applyServerErrors(messages: string[]) {
    const next: FieldErrors = {};
    for (const message of messages) {
      const lower = message.toLowerCase();
      if (lower.includes("username")) next.username = message;
      else if (lower.includes("email")) next.email = message;
      else if (lower.includes("phone")) next.phone = message;
      else if (lower.includes("password")) next.password = message;
      else next.general = next.general ? `${next.general} ${message}` : message;
    }
    setErrors(next);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    register.mutate(
      { username, email, phone, password },
      {
        onSuccess: () => router.push(ROUTES.home),
        onError: (err) => applyServerErrors(getApiErrorMessages(err)),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl leading-snug font-bold text-white sm:text-2xl">
          Sign up to explore a world of premium <span className="text-brand">AI movies</span> and{" "}
          <span className="text-brand">short films</span>.
        </h1>
        <p className="text-base text-[#CCCCCC]">
          Enjoy an exclusive library of original content, with fresh releases every day.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label required>Username</Label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
            />
            <Input
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 rounded-full pl-10"
              aria-invalid={Boolean(errors.username)}
              required
            />
          </div>
          <AnimatePresence>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 pl-1 text-xs text-red-500"
              >
                {errors.username}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Label required>Email</Label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
            />
            <Input
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
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
          <Label required>Phone Number</Label>
          <div className="relative">
            <Phone
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
            />
            <Input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ""))}
              className="h-12 rounded-full pl-10"
              aria-invalid={Boolean(errors.phone)}
              required
            />
          </div>
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 pl-1 text-xs text-red-500"
              >
                {errors.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Label required>Password</Label>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Enter password"
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

        <div>
          <Label required>Confirm password</Label>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={Boolean(errors.confirmPassword)}
            required
          />
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 pl-1 text-xs text-red-500"
              >
                {errors.confirmPassword}
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

        <Button type="submit" className="h-12 w-full" disabled={register.isPending}>
          {register.isPending ? "Đang tạo tài khoản..." : "Continue"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#CCCCCC]">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-brand hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
