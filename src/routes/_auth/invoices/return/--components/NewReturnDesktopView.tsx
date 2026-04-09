import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { InvoiceDesktopHeader } from "../../--components/shared/InvoiceDesktopHeader";
import { DesktopInvoiceItemTable } from "../../--components/shared/DesktopInvoiceItemTable";
import { CustomerSidebarCard } from "../../--components/shared/CustomerSidebarCard";
import { PricingSummaryCard } from "../../--components/shared/PricingSummaryCard";
import { useInvoiceContext } from "../../--components/context/InvoiceFormContext";
import InvoiceDesktopLayout from "../../--components/shared/InvoiceDesktopLayout";

export default function NewReturnDesktopView() {
  const { sales } = useInvoiceContext();
  const router = useRouter();

  return (
    <InvoiceDesktopLayout
      header={
        <InvoiceDesktopHeader
          title="New Return"
          status={DOCUMENT_STATUS.DRAFT}
          date={new Date()}
          refNumber={sales?.number}
        >
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-gray-400 hover:text-gray-600 transition-all h-10 px-4"
            onClick={() => router.history.back()}
          >
            Cancel
          </Button>
        </InvoiceDesktopHeader>
      }
      content={<DesktopInvoiceItemTable isDraft={true} mode="return" />}
      sidebar={
        <>
          <CustomerSidebarCard isDraft={false} />

          <PricingSummaryCard isDraft={true} />
        </>
      }
    />
  );
}
