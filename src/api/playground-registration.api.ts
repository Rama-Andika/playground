import type {
  PlaygroundRegistrationSearch,
  PlaygroundRegistrationView,
} from "@/interfaces/playground-registration.interface";
import axiosInstance from "./axiosInstance";
import type { TResponse } from "@/types/response.type";

export const getPlaygroundRegistrations = async (
  search: PlaygroundRegistrationSearch,
): Promise<TResponse<PlaygroundRegistrationView[]>> => {
  const response = await axiosInstance.get("/api/playground-registrations", {
    params: search,
  });
  const result: TResponse<PlaygroundRegistrationView[]> = response.data;
  return result;
};
