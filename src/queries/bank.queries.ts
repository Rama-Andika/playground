import { getBanks } from "@/api/bank.api";
import { queryOptions } from "@tanstack/react-query";

export const bankQueries = {
  all: () =>
    queryOptions({
      queryKey: ["bank"],
      queryFn: () => getBanks(),
      staleTime: 300_000, //5 minutes
    }),
};
