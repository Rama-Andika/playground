import type {
  PromotionSearch,
  PromotionView,
} from "@/interfaces/promotion.interface";
import type { TResponse } from "@/types/response.type";
import axiosInstance from "./axiosInstance";

export const getPromotions = async (
  query: PromotionSearch,
): Promise<TResponse<PromotionView[]>> => {
  const response = await axiosInstance.get("/api/promotions", {
    params: query,
  });
  const result: TResponse<PromotionView[]> = response.data;
  return result;
};
