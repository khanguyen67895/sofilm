"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useRequestPhoneOtp } from "../hooks/use-request-phone-otp";
import { useVerifyPhoneOtp } from "../hooks/use-verify-phone-otp";

function maskPhone(phone: string) {
  return phone.length > 7 ? `${phone.slice(0, 3)}***${phone.slice(-4)}` : phone;
}

export function PhoneLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const requestOtp = useRequestPhoneOtp();
  const verifyOtp = useVerifyPhoneOtp();

  function handlePhoneSubmit(e: FormEvent) {
    e.preventDefault();
    requestOtp.mutate({ phone }, { onSuccess: () => setStep("otp") });
  }

  function handleOtpSubmit(e: FormEvent) {
    e.preventDefault();
    verifyOtp.mutate(
      { phone, code },
      {
        onSuccess: (data) =>
          router.push(data.user.roles.includes("ADMIN") ? ROUTES.adminMovies : ROUTES.home),
      }
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "phone" ? (
        <motion.div
          key="phone"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-xl font-medium text-white sm:text-2xl">
              Đăng ký hoặc đăng nhập để khám phá thế giới{" "}
              <span className="text-brand">phim AI</span> và{" "}
              <span className="text-brand">phim ngắn</span> chất lượng cao
            </h1>
            <p className="text-sm text-white/50">
              Trải nghiệm kho phim độc quyền, nội dung sáng tạo và cập nhật mỗi ngày.
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <Input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              required
            />
            {requestOtp.isError && (
              <p className="text-sm text-red-500">Không gửi được mã OTP. Vui lòng thử lại.</p>
            )}
            <Button type="submit" className="w-full" disabled={requestOtp.isPending}>
              {requestOtp.isPending ? "Đang gửi mã..." : "Continue"}
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-xl font-medium text-white sm:text-2xl">
              Xác thực mã OTP
            </h1>
            <p className="text-sm text-white/50">
              Nhập mã OTP được gửi qua tin nhắn đến số điện thoại{" "}
              <span className="text-white">{maskPhone(phone)}</span>
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Nhập mã OTP"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              required
            />
            {verifyOtp.isError && (
              <p className="text-sm text-red-500">Mã OTP không đúng hoặc đã hết hạn.</p>
            )}
            <Button type="submit" className="w-full" disabled={verifyOtp.isPending}>
              {verifyOtp.isPending ? "Đang xác nhận..." : "Xác Nhận"}
            </Button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-xs text-white/50 transition-colors hover:text-white"
            >
              Bạn chưa nhận được mã? Chọn phương thức khác
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
