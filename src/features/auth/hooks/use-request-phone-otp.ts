import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import type { RequestPhoneOtpPayload } from "@/types/user";

export function useRequestPhoneOtp() {
  return useMutation({
    mutationFn: (payload: RequestPhoneOtpPayload) => authService.requestPhoneOtp(payload),
  });
}
