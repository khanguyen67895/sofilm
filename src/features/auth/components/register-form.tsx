"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    register.mutate(
      { name, email, password },
      { onSuccess: () => router.push(ROUTES.home) }
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
        placeholder="Họ tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      {register.isError && (
        <p className="text-sm text-red-500">Đăng ký thất bại. Vui lòng thử lại.</p>
      )}
      <Button type="submit" className="w-full" disabled={register.isPending}>
        {register.isPending ? "Đang tạo tài khoản..." : "Đăng Ký"}
      </Button>
    </motion.form>
  );
}
