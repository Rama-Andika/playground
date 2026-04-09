import { InvoiceMobileHeader } from "../../--components/shared/InvoiceMobileHeader";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { InvoiceInfoCard } from "../../--components/shared/InvoiceInfoCard";
import { MobileInvoiceItemList } from "../../--components/shared/MobileInvoiceItemList";
import { MobileStickyBottomBar } from "../../--components/shared/MobileStickyBottomBar";
import { Card, CardContent } from "@/components/ui/card";
import { useInvoiceContext } from "../../--components/context/InvoiceFormContext";
import InvoiceMobileLayout from "../../--components/shared/InvoiceMobileLayout";

export default function NewReturnMobileView() {
  const {
    sales,
    total,
    customerName,
    customerPhone,
    isPending,
    handleSave,
  } = useInvoiceContext();
  const router = useRouter();

  return (
    <InvoiceMobileLayout
      header={
        <InvoiceMobileHeader title="New Return" status={DOCUMENT_STATUS.DRAFT}>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-gray-400 hover:text-gray-600 transition-all h-10 px-4"
            onClick={() => router.history.back()}
          >
            Cancel
          </Button>
        </InvoiceMobileHeader>
      }
      infoCard={<InvoiceInfoCard number={sales?.number} date={new Date()} />}
      content={
        <MobileInvoiceItemList
          sales={sales}
          isDraft={true}
          onEditItem={() => {}}
          onDeleteItem={() => {}}
          onAddItem={() => {}}
        />
      }
      customerSection={
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1 h-4 bg-orange-500 rounded-full" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Customer Details
            </h2>
          </div>

          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-md font-bold text-gray-800 tracking-tight">
                    {customerName}
                  </p>
                  <p className="text-xs text-gray-400">Telp: {customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      bottomBar={
        <MobileStickyBottomBar
          total={total}
          isPending={isPending}
          handleSave={handleSave}
          isDraft={true}
        />
      }
    />
  );
}
