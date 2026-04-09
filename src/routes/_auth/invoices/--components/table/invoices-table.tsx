import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import columns from "./columns";
import { DataTablePagination } from "@/components/data-table-pagination";
import { salesTakingQueries } from "@/queries/sales-taking.queries";

const InvoicesTable = () => {
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
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        tableOptions={{
          meta: {
            start: data?.pagination.start ?? 1,
          },
          manualPagination: true,
        }}
      />
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
};

export default InvoicesTable;
