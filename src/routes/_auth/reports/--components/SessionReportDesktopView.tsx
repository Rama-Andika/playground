import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { columns } from "./columns-session-report";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ButtonSearch from "@/components/button/ButtonSearch";
import { Search } from "lucide-react";

interface Props {
  data: any[];
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    start: number;
  };
  registrationNumber: string;
  handleSearch: (e: React.FormEvent) => void;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

export default function SessionReportDesktopView({
  data,
  pagination,
  registrationNumber,
  handleSearch,
  onPageChange,
  onSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-8 p-10 max-w-[1440px] mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Session Report" 
          subtitle="List of all playground session reports" 
          className="mb-0! pb-0! border-b-0!" 
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/10">
          <form onSubmit={handleSearch}>
            <div className="flex items-center justify-end">
              <Field orientation="horizontal" className="flex items-center gap-2">
                <div className="relative group">
                  <Input
                    className="w-80 h-10 bg-white border-gray-200 focus-visible:ring-main rounded-xl pl-9 transition-all"
                    name="number"
                    defaultValue={registrationNumber}
                    placeholder="Search registration number..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-main transition-colors" />
                </div>
                
                <ButtonSearch />
              </Field>
            </div>
          </form>
        </div>

        <div className="overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            tableOptions={{
              getRowId: (row: any) => row.sessionId,
              meta: {
                start: pagination.start,
              },
              manualPagination: true,
            }}
          />
        </div>
        
        <div className="p-4 border-t border-gray-50 bg-gray-50/5">
          <DataTablePagination
            page={pagination.page}
            size={pagination.size}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
          />
        </div>
      </div>
    </div>
  );
}
