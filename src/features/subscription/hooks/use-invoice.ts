import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment/payment.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.invoice(invoiceId),
    queryFn: () => paymentService.verify(invoiceId),
    enabled: Boolean(invoiceId),
  });
}
