import type { CompanyView } from "@/interfaces/company.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getCompany = async (): Promise<CompanyView | undefined> => {
  const response = await axiosInstance.get("/api/company");
  const result: TResponse<CompanyView> = response.data;
  return result.data;
};
