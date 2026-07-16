import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/services/payment/payment.service";

export function useConfirmPayment() {
  return useMutation({
    mutationFn: (invoiceId: string) => paymentService.confirm(invoiceId),
  });
}
