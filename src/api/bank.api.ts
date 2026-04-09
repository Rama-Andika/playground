import type { BankView } from "@/interfaces/bank.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getBanks = async (): Promise<BankView[]> => {
  const response = await axiosInstance.get("/api/banks/for-select");
  const result: TResponse<BankView[]> = response.data;

  return result.data ?? [];
};
