import { getStrukKasirByLocationId } from "@/api/struk-kasir.api";
import { queryOptions } from "@tanstack/react-query";

export const strukKasirQueries = {
  byLocation: (locationId: string) =>
    queryOptions({
      queryKey: ["struk-kasir", locationId],
      queryFn: () => getStrukKasirByLocationId(locationId),
      staleTime: 10 * 60 * 1000, //5 minutes
    }),
};
