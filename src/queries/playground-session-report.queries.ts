import { getPlaygroundSessionReport } from "@/api/playground-session-report.api";
import type { PlaygroundSessionReportSearch } from "@/interfaces/playground-session-report.interface";
import { queryOptions } from "@tanstack/react-query";

export const playgroundSessionReportQueries = {
  sessionReport: (search: PlaygroundSessionReportSearch) =>
    queryOptions({
      queryKey: ["playground-session-report", search],
      queryFn: () => getPlaygroundSessionReport(search),
    }),
};
