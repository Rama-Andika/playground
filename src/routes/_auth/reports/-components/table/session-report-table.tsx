import { DataTable } from "@/components/data-table";
import { playgroundSessionReportQueries } from "@/queries/playground-session-report.queries";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ButtonSearch from "@/components/button/ButtonSearch";
import { queryClient } from "@/query/queryClient";
import { columns } from "../../--components/columns-session-report";

const SessionReportTable = () => {
  const route = getRouteApi("/_auth/reports/");
  const { registrationNumber, page, size } = route.useSearch();
  const navigate = route.useNavigate();

  //   =====QUERY=====
  //   ===============
  const { data } = useQuery(
    playgroundSessionReportQueries.sessionReport({
      registrationNumber,
      page,
      size,
    }),
  );

  const totalPages = data?.pagination.totalPages ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const registrationNumber = formData.get("number") as string;
    navigate({ search: (prev) => ({ ...prev, registrationNumber }) });
    queryClient.invalidateQueries({
      queryKey: playgroundSessionReportQueries.sessionReport({
        registrationNumber,
        page: page ?? 0,
        size: size ?? 50,
      }).queryKey,
    });
  };
  return (
    <>
      <form onSubmit={handleSearch}>
        <Field orientation="horizontal" className="flex justify-end ">
          <Input
            className="w-64"
            name="number"
            defaultValue={registrationNumber}
            placeholder="search by registration number..."
          />
          <ButtonSearch />
        </Field>
      </form>
      <DataTable
        columns={columns}
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

export default SessionReportTable;
