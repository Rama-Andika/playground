import type { MerchantView } from "@/interfaces/merchant.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getMerchantsByLocationId = async (
  locationId: string,
): Promise<MerchantView[]> => {
  const response = await axiosInstance.get(
    `/api/merchants-by-location/for-select/${locationId}`,
  );
  const result: TResponse<MerchantView[]> = response.data;

  return result.data ?? [];
};
