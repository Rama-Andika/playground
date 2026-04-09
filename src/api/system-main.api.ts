import type { SystemMainView } from "@/interfaces/system-main.interface";
import type { TResponse } from "@/types/response.type";
import axiosInstance from "./axiosInstance";

export const getSystemMain = async (
  name: string,
): Promise<SystemMainView | undefined> => {
  const response = await axiosInstance.get("/api/system-main", {
    params: { name },
  });
  const result: TResponse<SystemMainView> = response.data;
  return result.data;
};
