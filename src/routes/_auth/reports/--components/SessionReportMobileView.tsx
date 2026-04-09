import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Search, Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import ButtonSearch from "@/components/button/ButtonSearch";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

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

export default function SessionReportMobileView({
  data,
  pagination,
  registrationNumber,
  handleSearch,
  onPageChange,
  onSizeChange,
}: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onSearchSubmit = (e: React.FormEvent) => {
    handleSearch(e);
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 pb-32 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <PageHeader title="Session Report" subtitle="List of session reports" />

      <div className="px-4 mt-6">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl h-12 px-4 active:scale-[0.98] transition-all cursor-pointer">
              <Search className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 font-medium text-xs flex-1 uppercase tracking-widest">
                Search registration number...
              </span>
              <div className="bg-main/10 p-1 rounded-md">
                <Plus className="h-3 w-3 text-main" />
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="rounded-t-[32px] border-none shadow-2xl pb-safe">
            <form onSubmit={onSearchSubmit}>
              <DrawerHeader className="pt-8 pb-4">
                <DrawerTitle className="text-xl font-bold text-center text-gray-800 tracking-tight">
                  Search Reports
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-6 flex flex-col gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 ml-1">
                    Registration Number
                  </label>
                  <Input
                    name="number"
                    defaultValue={registrationNumber}
                    placeholder="Enter number..."
                    className="h-12 border border-gray-100 bg-gray-50 focus-visible:ring-2 focus-visible:ring-main rounded-xl px-4 text-gray-700"
                  />
                </div>
              </div>
              <DrawerFooter className="pb-10 pt-6 px-6">
                <ButtonSearch />
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="px-4 mt-8 space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-white rounded-3xl border border-dashed border-gray-200">
            No reports found
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.sessionId}
              className="bg-white rounded-3xl shadow-sm border border-gray-50 p-5 transition-all hover:shadow-md active:scale-[0.98] group"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                    {item.registrationNumber}
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-main/5 text-main border-main/10 rounded-md py-0 px-2 h-5">
                    {item.code}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-700 text-[17px] tracking-tight truncate leading-tight group-hover:text-main transition-colors">
                  {item.parentName}
                </h3>

                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase">
                    Child: {item.childName}
                  </p>
                  <span className="text-gray-200">•</span>
                  <p className="text-[11px] font-medium text-gray-400 uppercase">
                    {item.duration} Min
                  </p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] font-mono text-gray-400">
                    {item.endTime ? dayjs(item.endTime).format("DD MMM YYYY HH:mm") : "-"}
                  </p>
                  <div className="bg-gray-50/50 p-1.5 rounded-xl group-hover:bg-main/10 transition-colors">
                    <Search className="w-3.5 h-3.5 text-gray-300 group-hover:text-main transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-8">
        <DataTablePagination
          page={pagination.page}
          size={pagination.size}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          onSizeChange={onSizeChange}
        />
      </div>
    </div>
  );
}
