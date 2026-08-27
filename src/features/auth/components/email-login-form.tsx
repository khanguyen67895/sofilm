"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessages } from "@/utils/api-error";
import { useLogin } from "../hooks/use-login";
import { SocialLoginButtons } from "./social-login-buttons";

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function EmailLoginForm() {
  const router = useRouter();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = "Please enter your username or email.";
    if (!password) next.password = "Please enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    login.mutate(
      { email, password },
      {
        onSuccess: (data) =>
          router.push(data.user.roles.includes("ADMIN") ? ROUTES.adminMovies : ROUTES.home),
        onError: (err) => setErrors({ general: getApiErrorMessages(err).join(" ") }),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl leading-snug font-bold text-white sm:text-2xl">
          Sign in to explore a world of premium <span className="text-brand">AI movies</span> and{" "}
          <span className="text-brand">short films</span>.
        </h1>
        <p className="text-base text-[#CCCCCC]">
          Enjoy an exclusive library of original content, with fresh releases every day.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <Label required>Username or Email</Label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
            />
            <Input
              type="text"
              autoComplete="username"
              placeholder="Enter your username or email address."
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
          <Label required>Password</Label>
          <PasswordInput
            autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/70">
            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me
          </label>
          <Link href="#" className="text-brand hover:underline">
            Forgot password?
          </Link>
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
          {login.isPending ? "Signing in..." : "Continue"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-sm text-[#B2B2B2]">Or continue with</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <SocialLoginButtons />

      <p className="text-center text-sm text-[#CCCCCC]">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-brand hover:underline">
          Sign up now
        </Link>
      </p>
    </div>
  );
}
