import type { ParentSchemaType } from "@/schemas/parent.schema";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const saveParent = async (
  body: ParentSchemaType,
): Promise<Record<string, any> | undefined> => {
  const response = await axiosInstance.post("/api/parent", body);
  const result: TResponse<Record<string, any>> = response.data;
  return result.data;
};
