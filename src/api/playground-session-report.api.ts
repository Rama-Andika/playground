import type {
  PlaygroundSessionReportSearch,
  PlaygroundSessionReportView,
} from "@/interfaces/playground-session-report.interface";
import type { TResponse } from "@/types/response.type";
import axiosInstance from "./axiosInstance";

export const getPlaygroundSessionReport = async (
  search: PlaygroundSessionReportSearch,
): Promise<TResponse<PlaygroundSessionReportView[]>> => {
  const response = await axiosInstance.get("/api/playground-session/report", {
    params: search,
  });
  const result: TResponse<PlaygroundSessionReportView[]> = response.data;
  return result;
};
