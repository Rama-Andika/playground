import { getCustomers } from "@/api/customer.api";
import type { CustomerSearch } from "@/interfaces/customer.interface";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const customerQueries = {
  all: (search: CustomerSearch) =>
    queryOptions({
      queryKey: ["customers", search],
      queryFn: () => getCustomers(search),
      placeholderData: keepPreviousData,
    }),
};
