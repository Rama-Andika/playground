import { getPlaygroundRegistrations } from "@/api/playground-registration.api";
import type { PlaygroundRegistrationSearch } from "@/interfaces/playground-registration.interface";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const playgroundRegistrationQueries = {
  playgroundRegistrations: (search: PlaygroundRegistrationSearch) =>
    queryOptions({
      queryKey: ["playground-registrations", search],
      queryFn: () => getPlaygroundRegistrations(search),
      refetchOnMount: "always",
      placeholderData: keepPreviousData,
    }),
};
