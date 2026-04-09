import { getCompany } from "@/api/company.api";
import { queryOptions } from "@tanstack/react-query";

export const companyQueries = {
  company: () =>
    queryOptions({
      queryKey: ["company"],
      queryFn: getCompany,
      staleTime: 10 * 60 * 1000, //10 minutes
    }),
};
