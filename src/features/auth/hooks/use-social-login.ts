import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { SocialLoginPayload } from "@/types/user";

export function useSocialLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: SocialLoginPayload) => authService.socialLogin(payload),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
