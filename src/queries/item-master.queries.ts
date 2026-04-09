import {
  getItemMasterPrice,
  getItemMasters,
  getItemMastersPlayground,
  getItemMastersWithPrice,
} from "@/api/item-master.api";
import type {
  ItemMasterSearch,
  ItemMasterView,
} from "@/interfaces/item-master.interface";
import type { TResponse } from "@/types/response.type";
import {
  keepPreviousData,
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

export const itemMasterQueries = {
  all: (search: ItemMasterSearch) =>
    queryOptions({
      queryKey: ["item-masters", search],
      queryFn: () => getItemMasters(search),
      placeholderData: keepPreviousData,
    }),
  allWithPrice: (
    search: ItemMasterSearch,
    options?: Omit<
      UseQueryOptions<TResponse<ItemMasterView[]>, Error>,
      "queryKey" | "queryFn"
    >,
  ) =>
    queryOptions({
      queryKey: ["item-masters-with-price", search],
      queryFn: () => getItemMastersWithPrice(search),
      placeholderData: keepPreviousData,
      ...options,
    }),
  playground: () =>
    queryOptions({
      queryKey: ["item-masters-playground"],
      queryFn: getItemMastersPlayground,
      staleTime: 5 * 60 * 1000, //5 minutes,
    }),
  price: (itemMasterId: string, locationId: string) =>
    queryOptions({
      queryKey: ["item-master-price", itemMasterId, locationId],
      queryFn: () => getItemMasterPrice(itemMasterId, locationId),
      staleTime: 2 * 60 * 1000, //5 minutes
      enabled: !!itemMasterId && !!locationId,
    }),
};
