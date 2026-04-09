import type {
  SalesTakingPlaygroundView,
  SalesTakingSearch,
} from "@/interfaces/sales-taking.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";
import type { SalesTakingSchemaType } from "@/schemas/sales-taking.schema";

export const getSalesPlaygroundByNumber = async (
  number: string,
): Promise<SalesTakingPlaygroundView | undefined> => {
  const response = await axiosInstance.get(`/api/playground/sales`, {
    params: { number },
  });
  const results: TResponse<SalesTakingPlaygroundView> = response.data;
  return results.data;
};

export const getSalesTakingsWithPlayground = async (
  search: SalesTakingSearch,
): Promise<TResponse<SalesTakingPlaygroundView[]>> => {
  const response = await axiosInstance.get("/api/sales-takings/playground", {
    params: search,
  });
  const result: TResponse<SalesTakingPlaygroundView[]> = response.data;
  return result;
};

export const salesTakingUpdate = async (
  id: string,
  body: SalesTakingSchemaType,
): Promise<string> => {
  try {
    const response = await axiosInstance.put(
      `/api/sales-taking/${id}/edit`,
      body,
    );
    const result: TResponse<string> = response.data;
    return result.data ?? "";
  } catch (error) {
    throw error;
  }
};

export const salesTakingNew = async (
  body: SalesTakingSchemaType,
): Promise<string> => {
  try {
    const response = await axiosInstance.post("/api/sales-taking", body);
    const result: TResponse<string> = response.data;
    return result.data ?? "";
  } catch (error) {
    throw error;
  }
};

export const salesTakingNewReturn = async (
  id: string,
  body: SalesTakingSchemaType,
): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      `/api/sales-taking/return/${id}`,
      body,
    );
    const result: TResponse<string> = response.data;
    return result.data ?? "";
  } catch (error) {
    throw error;
  }
};

export const salesTakingUpdateReturn = async (
  id: string,
  body: SalesTakingSchemaType,
): Promise<string> => {
  try {
    const response = await axiosInstance.put(
      `/api/sales-taking/return/edit/${id}`,
      body,
    );
    const result: TResponse<string> = response.data;
    return result.data ?? "";
  } catch (error) {
    throw error;
  }
};
