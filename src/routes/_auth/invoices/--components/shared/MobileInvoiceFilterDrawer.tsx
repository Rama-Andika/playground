import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import ButtonSearch from "@/components/button/ButtonSearch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";

interface Props {
  number: string;
  status: string;
  handleSearch: (e: React.FormEvent) => void;
}

export function MobileInvoiceFilterDrawer({
  number,
  status,
  handleSearch,
}: Props) {
  const [open, setOpen] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    handleSearch(e);
    setOpen(false);
  };

  return (
    <div className="px-4 mt-6">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl h-12 px-4 active:scale-[0.98] transition-all cursor-pointer">
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 font-medium text-xs flex-1 uppercase tracking-widest">
              Tap to filter Invoices...
            </span>
            <div className="bg-main/10 p-1 rounded-md">
              <Plus className="h-3 w-3 text-main" />
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className="rounded-t-[32px] border-none shadow-2xl pb-safe">
          <form onSubmit={onSearch}>
            <DrawerHeader className="pt-8 pb-4">
              <DrawerTitle className="text-xl font-bold text-center text-gray-800 tracking-tight">
                Filter Records
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-6 flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 ml-1">
                  Invoice Number
                </label>
                <Input
                  name="number"
                  defaultValue={number}
                  placeholder="Search Number..."
                  className="h-12 border border-gray-100 bg-gray-50 focus-visible:ring-2 focus-visible:ring-main rounded-xl px-4 text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 ml-1">
                  Document Status
                </label>
                <Select defaultValue={status ?? "all"} name="status">
                  <SelectTrigger className="h-12 border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-main rounded-xl px-4 text-gray-700 w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-2xl overflow-hidden">
                    <SelectItem
                      value="all"
                      className="font-medium py-2.5 text-gray-400"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value={DOCUMENT_STATUS.DRAFT}
                      className="font-medium py-2.5 text-gray-700"
                    >
                      {DOCUMENT_STATUS.DRAFT}
                    </SelectItem>
                    <SelectItem
                      value={DOCUMENT_STATUS.APPROVED}
                      className="font-medium py-2.5 text-gray-700"
                    >
                      {DOCUMENT_STATUS.APPROVED}
                    </SelectItem>
                    <SelectItem
                      value={DOCUMENT_STATUS.CANCELED}
                      className="font-medium py-2.5 text-gray-700"
                    >
                      {DOCUMENT_STATUS.CANCELED}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DrawerFooter className="pb-10 pt-6 px-6">
              <ButtonSearch />
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
