import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/services/payment/payment.service";
import type { CheckoutPayload } from "@/types/subscription";

export function useCheckout() {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => paymentService.checkout(payload),
    onSuccess: (data) => {
      window.location.href = data.redirectUrl;
    },
  });
}
