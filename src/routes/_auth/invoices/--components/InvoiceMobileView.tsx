import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ListCardInvoice } from "./list-card-invoice";
import { Link } from "@tanstack/react-router";
import { MobileInvoiceFilterDrawer } from "./shared/MobileInvoiceFilterDrawer";

interface InvoiceMobileViewProps {
  title: string;
  subtitle: string;
  number: string;
  status: string;
  handleSearch: (e: React.FormEvent) => void;
}

export default function InvoiceMobileView({
  title,
  subtitle,
  number,
  status,
  handleSearch,
}: InvoiceMobileViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 pb-32 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <PageHeader title={title} subtitle={subtitle} />

      <MobileInvoiceFilterDrawer
        number={number}
        status={status}
        handleSearch={handleSearch}
      />

      <div className="px-4 mt-8 space-y-5">
        <ListCardInvoice />
      </div>

      <Link to="/invoices/new" className="fixed bottom-10 right-6 z-50 mb-safe">
        <Button className="w-16 h-16 rounded-full bg-main hover:bg-main/90 text-white shadow-2xl shadow-main/40 active:scale-90 transition-all duration-300 border-4 border-white flex items-center justify-center p-0">
          <Plus className="h-9 w-9 stroke-3" />
        </Button>
      </Link>
    </div>
  );
}
