import { getPromotions } from "@/api/promotion.api";
import type { PromotionSearch } from "@/interfaces/promotion.interface";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const promotionQueries = {
  promotion: (query: PromotionSearch) =>
    queryOptions({
      queryKey: ["promotions", query],
      queryFn: () => getPromotions(query),
      placeholderData: keepPreviousData,
      refetchOnMount: "always",
    }),
};
