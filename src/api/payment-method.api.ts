import type { PaymentMethodView } from "@/interfaces/payment-method.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getPaymentMethods = async (): Promise<PaymentMethodView[]> => {
  const response = await axiosInstance.get("/api/payment-method/for-select");
  const result: TResponse<PaymentMethodView[]> = response.data;

  return result.data ?? [];
};
