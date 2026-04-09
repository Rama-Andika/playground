import { getMerchantsByLocationId } from "@/api/merchant.api";
import { queryOptions } from "@tanstack/react-query";

export const merchantQueries = {
  byLocationId: (locationId: string) =>
    queryOptions({
      queryKey: ["merchants-by-location-id", locationId],
      queryFn: () => getMerchantsByLocationId(locationId),
      staleTime: 300_000, //5 minutes
    }),
};
