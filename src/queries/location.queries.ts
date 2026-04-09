import { getLocationsForSelect } from "@/api/location.api";
import { queryOptions } from "@tanstack/react-query";

export const locationQueries = {
  forSelect: (product: "GRAB_MART" | "GRAB_FOOD" | null) =>
    queryOptions({
      queryKey: ["locations-for-select", product],
      queryFn: () => getLocationsForSelect(product),
      staleTime: 10 * 60 * 1000,
    }),
};
