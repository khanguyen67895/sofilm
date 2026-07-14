"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { useRequestPhoneOtp } from "../hooks/use-request-phone-otp";
import { useVerifyPhoneOtp } from "../hooks/use-verify-phone-otp";
import { PhoneStep } from "./phone-step";
import { OtpStep } from "./otp-step";

const PHONE_PATTERN = /^0\d{9,10}$/;

export function PhoneLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [code, setCode] = useState("");

  const requestOtp = useRequestPhoneOtp();
  const verifyOtp = useVerifyPhoneOtp();

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value.replace(/[^0-9]/g, ""));
    setPhoneError("");
  }

  function handlePhoneSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      setPhoneError("Vui lòng nhập số điện thoại");
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      setPhoneError("Số điện thoại không hợp lệ");
      return;
    }
    setPhoneError("");
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
        >
          <PhoneStep
            phone={phone}
            phoneError={phoneError}
            isPending={requestOtp.isPending}
            isError={requestOtp.isError}
            onPhoneChange={handlePhoneChange}
            onSubmit={handlePhoneSubmit}
          />
        </motion.div>
      ) : (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <OtpStep
            phone={phone}
            code={code}
            isPending={verifyOtp.isPending}
            isError={verifyOtp.isError}
            onCodeChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            onSubmit={handleOtpSubmit}
            onChooseAnotherMethod={() => setStep("phone")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
