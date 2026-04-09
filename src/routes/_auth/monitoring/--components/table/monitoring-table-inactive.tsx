import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { playgroundSessionQueries } from "@/queries/playground-session.queries";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { columnsInactive } from "./columns-inactive";
import dayjs from "dayjs";

const MonitoringTableInactive = () => {
  const route = getRouteApi("/_auth/monitoring/");
  const navigate = route.useNavigate();
  const { date, page, size } = route.useSearch();

  //Query to fetch data
  const { data } = useQuery(
    playgroundSessionQueries.endSession({
      date: date ?? dayjs(new Date()).format("YYYY-MM-DD"),
      page: page ?? 0,
      size: size ?? 50,
    }),
  );
  const totalPages = data?.pagination.totalPages ?? 0;

  return (
    <>
      <DataTable
        columns={columnsInactive}
        data={data?.data ?? []}
        tableOptions={{
          getRowId: (row: any) => row.sessionId,
          meta: {
            start: data?.pagination.start ?? 1,
          },
          manualPagination: true,
        }}
      />
      <DataTablePagination
        page={page ?? 0}
        size={size ?? 50}
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

export default MonitoringTableInactive;
