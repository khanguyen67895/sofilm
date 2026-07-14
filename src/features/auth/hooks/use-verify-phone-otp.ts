import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { VerifyPhoneOtpPayload } from "@/types/user";

export function useVerifyPhoneOtp() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: VerifyPhoneOtpPayload) => authService.verifyPhoneOtp(payload),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
