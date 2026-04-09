import { Card, CardContent } from "@/components/ui/card";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import { RotateCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuPencil } from "react-icons/lu";
import SmallInvoice from "./print/small-invoice.print";
import { salesTakingDetailPlaygroundViewInitialValue } from "@/interfaces/sales-taking-detail.interface";
import { InvoiceMobileHeader } from "./shared/InvoiceMobileHeader";
import { InvoiceInfoCard } from "./shared/InvoiceInfoCard";
import { MobileInvoiceItemList } from "./shared/MobileInvoiceItemList";
import { MobileStickyBottomBar } from "./shared/MobileStickyBottomBar";
import { useInvoiceContext } from "./context/InvoiceFormContext";
import InvoiceMobileLayout from "./shared/InvoiceMobileLayout";
import { cn } from "@/lib/utils";

interface Props {
  number: string;
}

export default function NewInvoiceMobileView({ number }: Props) {
  const {
    sales,
    total,
    customerName,
    customerPhone,
    isPending,
    errors,
    printRef,
    setDialogCustomer,
    setDialogInvoiceItem,
    setSalesDetail,
    handleSave,
    handleClickReset,
    deleteDetail,
  } = useInvoiceContext();

  return (
    <InvoiceMobileLayout
      header={
        <InvoiceMobileHeader title="New Invoice" status={DOCUMENT_STATUS.DRAFT}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClickReset}
            className="h-10 w-10 text-gray-400 hover:text-gray-600 rounded-xl"
          >
            <RotateCwIcon size={20} />
          </Button>
          <SmallInvoice id={number} hideButton ref={printRef ?? null} />
        </InvoiceMobileHeader>
      }
      infoCard={<InvoiceInfoCard number={number} date={new Date()} />}
      content={
        <MobileInvoiceItemList
          sales={sales}
          isDraft={true}
          onEditItem={(item) => {
            setSalesDetail(item);
            setDialogInvoiceItem(true);
          }}
          onDeleteItem={deleteDetail}
          onAddItem={() => {
            setSalesDetail(salesTakingDetailPlaygroundViewInitialValue());
            setDialogInvoiceItem(true);
          }}
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

          <Card
            className={cn(
              "rounded-3xl border shadow-sm bg-white overflow-hidden group",
              errors?.customerId ? "border-red-300" : "border-gray-100",
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-md font-bold text-gray-800 tracking-tight">
                    {customerName}
                  </p>
                  <p className="text-xs text-gray-400">Telp: {customerPhone}</p>
                  {errors?.customerId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customerId}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogCustomer(true)}
                  className="h-9 w-9 text-orange-500 hover:bg-orange-50 rounded-xl"
                >
                  <LuPencil size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      bottomBar={
        <MobileStickyBottomBar
          total={total}
          isPending={isPending}
          isDraft={true}
          handleSave={handleSave}
        />
      }
    />
  );
}
