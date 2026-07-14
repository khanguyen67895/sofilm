"use client";

import { type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function maskPhone(phone: string) {
  return phone.length > 7 ? `${phone.slice(0, 3)}***${phone.slice(-4)}` : phone;
}

interface OtpStepProps {
  phone: string;
  code: string;
  isPending: boolean;
  isError: boolean;
  onCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onChooseAnotherMethod: () => void;
}

export function OtpStep({
  phone,
  code,
  isPending,
  isError,
  onCodeChange,
  onSubmit,
  onChooseAnotherMethod,
}: OtpStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">Xác thực mã OTP</h1>
        <p className="text-sm text-white/50">
          Nhập mã OTP được gửi qua tin nhắn đến số điện thoại{" "}
          <span className="text-white">{maskPhone(phone)}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Nhập mã OTP"
          value={code}
          onChange={onCodeChange}
          className="h-12 rounded-full text-center tracking-widest"
          required
        />
        <AnimatePresence>
          {isError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500"
            >
              Mã OTP không đúng hoặc đã hết hạn.
            </motion.p>
          )}
        </AnimatePresence>
        <Button type="submit" className="h-12 w-full" disabled={isPending}>
          {isPending ? "Đang xác nhận..." : "Xác Nhận"}
        </Button>
        <button
          type="button"
          onClick={onChooseAnotherMethod}
          className="w-full text-center text-xs text-white/50 transition-colors hover:text-white"
        >
          Bạn chưa nhận được mã? Chọn phương thức khác
        </button>
      </form>
    </div>
  );
}
