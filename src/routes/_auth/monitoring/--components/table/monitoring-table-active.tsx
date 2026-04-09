import { DataTable } from "@/components/data-table";
import { playgroundSessionQueries } from "@/queries/playground-session.queries";
import { useQuery } from "@tanstack/react-query";
import { columnsActive } from "./columns-active";

const MonitoringTableActive = () => {
  const { data } = useQuery(playgroundSessionQueries.liveSession());
  return (
    <DataTable
      columns={columnsActive}
      data={data ?? []}
      tableOptions={{
        getRowId: (row: any) => row.sessionId,
        manualPagination: true,
      }}
    />
  );
};

export default MonitoringTableActive;
