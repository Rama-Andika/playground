import { Page, Block } from "konsta/react";
import dayjs from "dayjs";
import type { RegistrationRecordsProps } from "./types";
import { PageHeader } from "@/components/page-header";
import { DataTablePagination } from "@/components/data-table-pagination";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";

const RegistrationRecordsMobile = ({
  data,
  page,
  size,
  totalPages,
  onPageChange,
  onSizeChange,
}: RegistrationRecordsProps) => {
  return (
    <Page className="pt-16 pb-24 pb-safe">
      <PageHeader
        title="Registration Records"
        subtitle="List of registration records"
      />

      <Block inset className="mt-4"></Block>

      {data.length === 0 ? (
        <Block strong inset className="text-center text-muted-foreground p-8">
          No registration records found.
        </Block>
      ) : (
        <div className="px-4 mt-2 space-y-4">
          {data.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-50 p-5 transition-all hover:shadow-md active:scale-[0.98] flex items-center justify-between group animate-in fade-in duration-300"
            >
              <div className="flex flex-col gap-1 overflow-hidden pr-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                    {record.regNumber}
                  </span>
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${record.status === DOCUMENT_STATUS.APPROVED ? "bg-green-400" : "bg-orange-400"}`}
                  />
                </div>

                <h3 className="font-semibold text-gray-700 text-[17px] tracking-tight truncate leading-tight transition-colors group-hover:text-main">
                  {record.parentName}
                </h3>

                <p className="text-[11px] font-medium text-gray-400 uppercase mt-0.5">
                  {dayjs(record.createdDate).format("DD MMM YYYY")}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  {record.status || "Completed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTablePagination
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
      />
    </Page>
  );
};

export default RegistrationRecordsMobile;
