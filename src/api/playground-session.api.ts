import type {
  PlaygroundSessionSearch,
  PlaygroundSessionView,
} from "@/interfaces/playground-session.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getLiveSession = async (): Promise<PlaygroundSessionView[]> => {
  const response = await axiosInstance.get("/api/playground-live-sessions");
  const result: TResponse<PlaygroundSessionView[]> = response.data;
  return result.data ?? [];
};

export const getEndSession = async (
  search: PlaygroundSessionSearch,
): Promise<TResponse<PlaygroundSessionView[]>> => {
  const response = await axiosInstance.get("/api/playground-end-sessions", {
    params: search,
  });
  const result: TResponse<PlaygroundSessionView[]> = response.data;
  return result;
};

export const stopSession = async (id: string) => {
  await axiosInstance.patch(`/api/playground-session/${id}/stop`);
};
