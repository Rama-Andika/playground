import { salesTakingQueries } from "@/queries/sales-taking.queries";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { CardInvoice } from "./card-invoice";
import { DataTablePagination } from "@/components/data-table-pagination";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";

export function ListCardInvoice() {
  const route = getRouteApi("/_auth/invoices/");
  const { number, status, page, size } = route.useSearch();
  const navigate = route.useNavigate();

  //Query to fetch data
  const { data } = useQuery(
    salesTakingQueries.salesPlayground({
      number,
      status,
      page: page ?? 1,
      size: size ?? 25,
    }),
  );

  const totalPages = data?.pagination.totalPages ?? 0;
  return (
    <>
      {data?.data?.map((invoice: SalesTakingPlaygroundView) => (
        <CardInvoice key={invoice.id} data={invoice} />
      ))}
      <DataTablePagination
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={(nextPage) =>
          navigate({
            search: (prev) => ({
              ...prev,
              page: Math.max(0, nextPage),
            }),
          })
        }
        onSizeChange={(nextSize) =>
          navigate({
            search: (prev) => ({
              ...prev,
              size: nextSize,
              page: 0, // 🔑 reset page ketika size berubah
            }),
          })
        }
      />
    </>
  );
}
