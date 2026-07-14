"use client";

import { type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginFeaturesRow } from "./login-features-row";
import { SocialLoginButtons } from "./social-login-buttons";

interface PhoneStepProps {
  phone: string;
  phoneError: string;
  isPending: boolean;
  isError: boolean;
  onPhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

export function PhoneStep({
  phone,
  phoneError,
  isPending,
  isError,
  onPhoneChange,
  onSubmit,
}: PhoneStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl leading-snug font-bold text-white sm:text-2xl">
          Đăng ký hoặc đăng nhập để khám phá thế giới{" "}
          <span className="text-brand">phim AI</span> và{" "}
          <span className="text-brand">phim ngắn</span> chất lượng cao
        </h1>
        <p className="text-base text-[#CCCCCC]">
          Trải nghiệm kho phim độc quyền, nội dung sáng tạo và cập nhật mỗi ngày.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <Phone
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
          />
          <Input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Phone number"
            value={phone}
            onChange={onPhoneChange}
            className="h-12 text-lg rounded-full pl-10"
          />
        </div>
        <AnimatePresence>
          {phoneError ? (
            <motion.p
              key="phone-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500"
            >
              {phoneError}
            </motion.p>
          ) : (
            isError && (
              <motion.p
                key="otp-request-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                Không gửi được mã OTP. Vui lòng thử lại.
              </motion.p>
            )
          )}
        </AnimatePresence>
        <Button type="submit" className="h-12 w-full" disabled={isPending}>
          {isPending ? "Đang gửi mã..." : "Continue"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-px flex-1 bg-white/10"
        />
        <span className="text-sm text-[#B2B2B2]">Hoặc đăng nhập bằng</span>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-px flex-1 bg-white/10"
        />
      </div>

      <SocialLoginButtons />
      <LoginFeaturesRow />
    </div>
  );
}
