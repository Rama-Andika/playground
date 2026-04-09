import type { StrukKasirView } from "@/interfaces/struk-kasir.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getStrukKasirByLocationId = async(
  locationId: string,
): Promise<StrukKasirView | undefined> => {
  const response = await axiosInstance.get(`/api/struk-kasir/${locationId}`);
  const result: TResponse<StrukKasirView> = response.data;
  return result.data;
};
