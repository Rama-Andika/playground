import { getPaymentMethods } from "@/api/payment-method.api";
import type { PaymentMethodView } from "@/interfaces/payment-method.interface";
import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";

export const paymentMethodQueries = {
  all: (
    options?: Omit<
      UseQueryOptions<PaymentMethodView[], Error>,
      "queryKey" | "queryFn"
    >,
  ) =>
    queryOptions({
      queryKey: ["payment-methods"],
      queryFn: getPaymentMethods,
      staleTime: 300_000,
      ...options,
    }),
};
