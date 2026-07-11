import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment/payment.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function usePlans() {
  return useQuery({
    queryKey: QUERY_KEYS.plans,
    queryFn: () => paymentService.getPlans(),
  });
}
