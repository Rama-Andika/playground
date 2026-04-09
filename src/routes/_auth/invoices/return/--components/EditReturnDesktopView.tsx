import {
  DOCUMENT_STATUS,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { InvoiceDesktopHeader } from "../../--components/shared/InvoiceDesktopHeader";
import { DesktopInvoiceItemTable } from "../../--components/shared/DesktopInvoiceItemTable";
import { CustomerSidebarCard } from "../../--components/shared/CustomerSidebarCard";
import { PricingSummaryCard } from "../../--components/shared/PricingSummaryCard";
import { useInvoiceContext } from "../../--components/context/InvoiceFormContext";
import InvoiceDesktopLayout from "../../--components/shared/InvoiceDesktopLayout";
import SmallInvoice from "../../--components/print/small-invoice.print";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditReturnDesktopView() {
  const {
    sales,
    docStatus,
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
        </InvoiceDesktopHeader>
      }
      content={<DesktopInvoiceItemTable isDraft={isDraft} mode="return-edit" />}
      sidebar={
        <>
          <CustomerSidebarCard isDraft={false} />

          <PricingSummaryCard isDraft={isDraft}>
            {isDraft && (
              <div className="space-y-4 pt-4">
                <Separator className="bg-main/10" />
                <div className="space-y-2">
                  <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">
                    Set Document Status
                  </Label>
                  <Select
                    value={docStatus}
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
