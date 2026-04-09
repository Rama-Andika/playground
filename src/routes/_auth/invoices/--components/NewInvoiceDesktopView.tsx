import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import SmallInvoice from "./print/small-invoice.print";
import { RotateCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceDesktopHeader } from "./shared/InvoiceDesktopHeader";
import { DesktopInvoiceItemTable } from "./shared/DesktopInvoiceItemTable";
import { CustomerSidebarCard } from "./shared/CustomerSidebarCard";
import { PricingSummaryCard } from "./shared/PricingSummaryCard";
import { useInvoiceContext } from "./context/InvoiceFormContext";
import InvoiceDesktopLayout from "./shared/InvoiceDesktopLayout";

interface Props {
  number: string;
}

export default function NewInvoiceDesktopView({ number }: Props) {
  const { errors, printRef, setDialogCustomer, handleClickReset } =
    useInvoiceContext();

  return (
    <InvoiceDesktopLayout
      header={
        <InvoiceDesktopHeader title="New Invoice" status={DOCUMENT_STATUS.DRAFT}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClickReset}
            className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all h-10 px-4"
          >
            <RotateCwIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <SmallInvoice id={number} hideButton ref={printRef ?? null} />
        </InvoiceDesktopHeader>
      }
      content={<DesktopInvoiceItemTable isDraft={true} mode="invoice" />}
      sidebar={
        <>
          <CustomerSidebarCard
            isDraft={true}
            onEditClick={() => setDialogCustomer(true)}
            error={errors?.customerId}
          />

          <PricingSummaryCard isDraft={true} />
        </>
      }
    />
  );
}
