import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import columns from "../../--components/table/columns";
import type { RegistrationRecordsProps } from "./types";

const RegistrationRecordsDesktop = ({
  data,
  page,
  size,
  totalPages,
  start,
  onPageChange,
  onSizeChange,
}: RegistrationRecordsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={data}
        tableOptions={{
          meta: {
            start: start,
          },
          manualPagination: true,
        }}
      />
      <DataTablePagination
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
      />
    </div>
  );
};

export default RegistrationRecordsDesktop;
