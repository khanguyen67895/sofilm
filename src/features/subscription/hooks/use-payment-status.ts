import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment/payment.service";
import { QUERY_KEYS } from "@/constants/query-keys";

const POLL_INTERVAL_MS = 4000;

/** Polls invoice status every 4s while a bank-transfer checkout is pending —
 * stops once it lands on a terminal state (PAID/FAILED/REFUNDED). */
export function usePaymentStatus(invoiceId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.paymentStatus(invoiceId ?? ""),
    queryFn: () => paymentService.getStatus(invoiceId!),
    enabled: Boolean(invoiceId),
    refetchInterval: (query) => (query.state.data?.status === "PENDING" ? POLL_INTERVAL_MS : false),
  });
}
