import { getEndSession, getLiveSession } from "@/api/playground-session.api";
import type { PlaygroundSessionSearch } from "@/interfaces/playground-session.interface";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const playgroundSessionQueries = {
  liveSession: () =>
    queryOptions({
      queryKey: ["live-session"],
      queryFn: () => getLiveSession(),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchInterval: (query) => {
        const data = query.state.data;

        if (!data) return 30_000;

        const hasActive = data.some((s) => s.status !== "INACTIVE");

        return hasActive ? 30_000 : false;
      },

      staleTime: 15_000, //15 seconds
      placeholderData: keepPreviousData,
    }),
  endSession: (search: PlaygroundSessionSearch) =>
    queryOptions({
      queryKey: ["end-session", search],
      queryFn: () => getEndSession(search),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      placeholderData: keepPreviousData,
    }),
};
