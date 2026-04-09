import type { TSelectOption } from "@/components/ui/SelectReact";
import type { TResponse } from "@/types/response.type";
import axiosInstance from "./axiosInstance";

export const getLocationsForSelect = async (
  product: "GRAB_MART" | "GRAB_FOOD" | null
): Promise<TSelectOption[]> => {
  const response = await axiosInstance.get(
    `/api/locations/grab/select?product=${product}`
  );
  const result: TResponse<{ id: string; name: string }[]> = response.data;
  if (result.data) {
    const options = result.data.map((location) => ({
      value: location.id,
      label: location.name,
    }));

    options.unshift({ value: "", label: "All" });

    return options;
  } else {
    return [];
  }
};
