import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import InvoicesTable from "./table/invoices-table";
import ButtonSearch from "@/components/button/ButtonSearch";
import { Link } from "@tanstack/react-router";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";

interface InvoiceDesktopViewProps {
  title: string;
  subtitle: string;
  number: string;
  status: string;
  handleSearch: (e: React.FormEvent) => void;
}

export default function InvoiceDesktopView({
  title,
  subtitle,
  number,
  status,
  handleSearch,
}: InvoiceDesktopViewProps) {
  return (
    <div className="flex flex-col gap-8 p-10 max-w-[1440px] mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <PageHeader
          title={title}
          subtitle={subtitle}
          className="mb-0! pb-0! border-b-0!"
        />
        <Link to="/invoices/new">
          <Button className="bg-main hover:bg-main/90 text-white rounded-xl shadow-md h-11 px-6 transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" />
            <span className="font-semibold">New Invoice</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/10">
          <form onSubmit={handleSearch}>
            <div className="flex items-center justify-end">
              <Field
                orientation="horizontal"
                className="flex items-center gap-2"
              >
                <div className="relative group">
                  <Input
                    className="w-80 h-10 bg-white border-gray-200 focus-visible:ring-main rounded-xl pl-9 transition-all"
                    name="number"
                    defaultValue={number}
                    placeholder="Search registration number..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-main transition-colors" />
                </div>

                <Select defaultValue={status} name="status">
                  <SelectTrigger className="w-44 h-10 bg-white border-gray-200 focus:ring-main rounded-xl font-medium text-gray-600">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    <SelectItem
                      value="all"
                      className="font-medium text-gray-400"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem value={DOCUMENT_STATUS.DRAFT}>
                      {DOCUMENT_STATUS.DRAFT}
                    </SelectItem>
                    <SelectItem value={DOCUMENT_STATUS.APPROVED}>
                      {DOCUMENT_STATUS.APPROVED}
                    </SelectItem>
                    <SelectItem value={DOCUMENT_STATUS.CANCELED}>
                      {DOCUMENT_STATUS.CANCELED}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <ButtonSearch />
              </Field>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-lg">
          <InvoicesTable />
        </div>
      </div>
    </div>
  );
}
