import {
  DOCUMENT_STATUS,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { InvoiceDesktopHeader } from "./shared/InvoiceDesktopHeader";
import { DesktopInvoiceItemTable } from "./shared/DesktopInvoiceItemTable";
import { CustomerSidebarCard } from "./shared/CustomerSidebarCard";
import { PricingSummaryCard } from "./shared/PricingSummaryCard";
import { useInvoiceContext } from "./context/InvoiceFormContext";
import InvoiceDesktopLayout from "./shared/InvoiceDesktopLayout";
import SmallInvoice from "./print/small-invoice.print";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditInvoiceDesktopView() {
  const {
    sales,
    status,
    docStatus,
    userLevel,
    userLevelCanCancelSales,
    setDialogCustomer,
    setStatus,
    printRef,
  } = useInvoiceContext();
  const isDraft = docStatus === DOCUMENT_STATUS.DRAFT;

  return (
    <InvoiceDesktopLayout
      header={
        <InvoiceDesktopHeader
          title={sales?.number || "Loading..."}
          status={docStatus as DocumentStatusType}
          date={sales?.date}
        >
          <SmallInvoice id={sales.number ?? ""} ref={printRef ?? null} />

          {docStatus === DOCUMENT_STATUS.APPROVED && (
            <Link
              to="/invoices/return/new/$id"
              params={{ id: sales.number ?? "" }}
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 h-10 px-4 transition-all"
              >
                <IoReturnDownBackOutline className="mr-2 h-4 w-4" />
                Return
              </Button>
            </Link>
          )}

          <Link to="/invoices/new">
            <Button className="bg-main hover:bg-main/90 text-white rounded-xl shadow-md h-10 px-4 transition-all active:scale-95">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </InvoiceDesktopHeader>
      }
      content={<DesktopInvoiceItemTable isDraft={isDraft} mode="invoice" />}
      sidebar={
        <>
          <CustomerSidebarCard
            isDraft={isDraft}
            onEditClick={() => setDialogCustomer(true)}
          />

          <PricingSummaryCard isDraft={isDraft}>
            {isDraft && (
              <div className="space-y-4 pt-4">
                <Separator className="bg-main/10" />
                <div className="space-y-2">
                  <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">
                    Set Document Status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as DocumentStatusType)
                    }
                  >
                    <SelectTrigger className="rounded-2xl h-11 border-gray-100 focus:ring-main shadow-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl overflow-hidden border-gray-100 shadow-xl">
                      <SelectItem value={DOCUMENT_STATUS.DRAFT}>
                        Draft
                      </SelectItem>
                      <SelectItem value={DOCUMENT_STATUS.APPROVED}>
                        Approve
                      </SelectItem>
                      {userLevelCanCancelSales.includes(userLevel) && (
                        <SelectItem value={DOCUMENT_STATUS.CANCELED}>
                          Cancel
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </PricingSummaryCard>
        </>
      }
    />
  );
}
