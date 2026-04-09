import { getSystemMain } from "@/api/system-main.api";
import { queryOptions } from "@tanstack/react-query";

export const systemMainQueries = {
  systemMain: (name: string) =>
    queryOptions({
      queryKey: ["system-main", name],
      queryFn: () => getSystemMain(name),
      staleTime: 300_000, //5 minutes
    }),
};
