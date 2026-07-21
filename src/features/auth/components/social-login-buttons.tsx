"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FacebookIcon, GoogleIcon } from "@/components/common/social-icons";
import { ROUTES } from "@/constants/routes";
import { SOCIAL_AUTH_CONFIG } from "@/constants/config";
import { requestGoogleAccessToken } from "@/lib/google-identity";
import { requestFacebookAccessToken } from "@/lib/facebook-sdk";
import { getApiErrorMessages } from "@/utils/api-error";
import { useSocialLogin } from "../hooks/use-social-login";
import type { SocialProvider } from "@/types/user";

export function SocialLoginButtons() {
  const router = useRouter();
  const socialLogin = useSocialLogin();
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  function afterLogin(user: { roles: string[] }) {
    router.push(user.roles.includes("ADMIN") ? ROUTES.adminMovies : ROUTES.home);
  }

  async function handleGoogle() {
    if (!SOCIAL_AUTH_CONFIG.googleClientId) {
      setError("Đăng nhập Google chưa được cấu hình.");
      return;
    }
    setError(null);
    setPendingProvider("google");
    try {
      const token = await requestGoogleAccessToken(SOCIAL_AUTH_CONFIG.googleClientId);
      const data = await socialLogin.mutateAsync({ provider: "google", token });
      afterLogin(data.user);
    } catch (err) {
      setError(
        err && typeof err === "object" && "isAxiosError" in err
          ? getApiErrorMessages(err).join(" ")
          : "Đăng nhập Google thất bại. Vui lòng thử lại."
      );
    } finally {
      setPendingProvider(null);
    }
  }

  async function handleFacebook() {
    if (!SOCIAL_AUTH_CONFIG.facebookAppId) {
      setError("Đăng nhập Facebook chưa được cấu hình.");
      return;
    }
    setError(null);
    setPendingProvider("facebook");
    try {
      const token = await requestFacebookAccessToken(SOCIAL_AUTH_CONFIG.facebookAppId);
      const data = await socialLogin.mutateAsync({ provider: "facebook", token });
      afterLogin(data.user);
    } catch (err) {
      setError(
        err && typeof err === "object" && "isAxiosError" in err
          ? getApiErrorMessages(err).join(" ")
          : "Đăng nhập Facebook thất bại. Vui lòng thử lại."
      );
    } finally {
      setPendingProvider(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2 text-base"
          onClick={handleGoogle}
          disabled={pendingProvider !== null}
        >
          <GoogleIcon width={25} height={25} />
          {pendingProvider === "google" ? "Đang xử lý..." : "GOOGLE"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2 text-base"
          onClick={handleFacebook}
          disabled={pendingProvider !== null}
        >
          <FacebookIcon width={25} height={25} className="text-[#1877F2]" />
          {pendingProvider === "facebook" ? "Đang xử lý..." : "FACEBOOK"}
        </Button>
      </div>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-0 flex-1 self-stretch outline outline-1 outline-offset-[-0.50px] outline-white/0"
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-0 flex-1 self-stretch outline outline-1 outline-offset-[-0.50px] outline-white/0"
        />
      </div>
    </>
  );
}
