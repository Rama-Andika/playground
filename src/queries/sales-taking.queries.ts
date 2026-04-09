import {
  getSalesPlaygroundByNumber,
  getSalesTakingsWithPlayground,
} from "@/api/sales-taking.api";
import type {
  SalesTakingPlaygroundView,
  SalesTakingSearch,
} from "@/interfaces/sales-taking.interface";
import {
  keepPreviousData,
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

export const salesTakingQueries = {
  salesPlayground: (search: SalesTakingSearch) =>
    queryOptions({
      queryKey: ["sales-takings", search],
      queryFn: () => getSalesTakingsWithPlayground(search),
      refetchOnMount: "always",
      placeholderData: keepPreviousData,
    }),
  salesPlaygroundByNumber: (
    number: string,
    options?: Omit<
      UseQueryOptions<SalesTakingPlaygroundView | undefined, Error>,
      "queryKey" | "queryFn"
    >,
  ) =>
    queryOptions({
      queryKey: ["sales-taking", number],
      queryFn: () => getSalesPlaygroundByNumber(number),
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      ...options,
    }),
};
