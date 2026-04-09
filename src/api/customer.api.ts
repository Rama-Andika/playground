import type {
  CustomerSearch,
  CustomerView,
} from "@/interfaces/customer.interface";
import type { TResponse } from "@/types/response.type";
import axiosInstance from "./axiosInstance";

export const getCustomers = async (
  search: CustomerSearch,
): Promise<TResponse<CustomerView[]>> => {
  const response = await axiosInstance.get("/api/customers", {
    params: search,
  });
  const result: TResponse<CustomerView[]> = response.data;
  return result;
};
