import type { SalesTakingDetailPlaygroundView } from "@/interfaces/sales-taking-detail.interface";
import axiosInstance from "./axiosInstance";

export const deleteSalesTakingDetail = async (id: string) => {
  await axiosInstance.delete(`/api/sales-taking-detail/${id}`);
};

export const deleteSalesTakingDetails = async (ids: string[]) => {
  await axiosInstance.delete(
    `/api/sales-taking-details?salesTakingDetailIds=${ids.join(",")}`,
  );
};

export const getSalesTakingDetailById = async (id: string) => {
  const response = await axiosInstance.get(`/api/sales-taking-detail/${id}`);
  return response.data;
};

export const getSalesTakingDetailsByIds = async (
  ids: string[],
): Promise<SalesTakingDetailPlaygroundView[]> => {
  const response = await axiosInstance.get(
    `/api/sales-taking-detail/by-ids?salesTakingDetailIds=${ids.join(",")}`,
  );
  return response.data;
};
