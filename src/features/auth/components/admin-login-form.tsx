"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "../hooks/use-login";

/** Email/password login for admin accounts (created via `npm run promote-admin`) — consumer login uses PhoneLoginForm instead. */
export function AdminLoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: () => router.push(ROUTES.adminMovies) }
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <AnimatePresence>
        {login.isError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-500"
          >
            Đăng nhập thất bại. Vui lòng thử lại.
          </motion.p>
        )}
      </AnimatePresence>
      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
      </Button>
    </motion.form>
  );
}
