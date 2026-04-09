import {
  DOCUMENT_STATUS,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { useRouter } from "@tanstack/react-router";
import { InvoiceMobileHeader } from "../../--components/shared/InvoiceMobileHeader";
import { InvoiceInfoCard } from "../../--components/shared/InvoiceInfoCard";
import { MobileInvoiceItemList } from "../../--components/shared/MobileInvoiceItemList";
import { MobileStickyBottomBar } from "../../--components/shared/MobileStickyBottomBar";
import { Card, CardContent } from "@/components/ui/card";
import { LuPencil } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceContext } from "../../--components/context/InvoiceFormContext";
import SmallInvoice from "../../--components/print/small-invoice.print";

export default function EditReturnMobileView() {
  const {
    sales,
    total,
    customerName,
    customerPhone,
    isPending,
    status,
    docStatus,
    userLevelCanCancelSales,
    userLevel,
    setDialogCustomer,
    setDialogInvoiceItem,
    setSalesDetail,
    handleSave,
    setStatus,
    deleteDetail,
    printRef,
  } = useInvoiceContext();
  const router = useRouter();
  const isDraft = docStatus === DOCUMENT_STATUS.DRAFT;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <InvoiceMobileHeader
        title={sales?.number || "Return Detail"}
        status={docStatus}
        onBack={() => router.history.back()}
      >
        <SmallInvoice id={sales?.number ?? ""} ref={printRef ?? null} />
      </InvoiceMobileHeader>

      <InvoiceInfoCard number={sales?.number} date={sales?.date} />

      <div className="flex flex-col gap-8 px-4">
        <MobileInvoiceItemList
          sales={sales}
          isDraft={isDraft}
          mode="return-edit"
          onEditItem={(detail) => {
            setSalesDetail(detail);
            setDialogInvoiceItem(true);
          }}
          onDeleteItem={deleteDetail}
        />

        {/* Section: Customer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1 h-4 bg-main rounded-full" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Customer Details
            </h2>
          </div>
          <Card className="rounded-3xl border-gray-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-md font-bold text-gray-800 tracking-tight">
                    {customerName}
                  </p>
                  <p className="text-xs text-gray-400">Telp: {customerPhone}</p>
                </div>
                {isDraft && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDialogCustomer(true)}
                    className="h-9 w-9 text-main hover:bg-main/5"
                  >
                    <LuPencil size={14} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileStickyBottomBar
        total={total}
        isPending={isPending}
        handleSave={handleSave}
        isDraft={isDraft}
      >
        {isDraft && (
          <div className="min-w-[120px]">
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as DocumentStatusType)}
            >
              <SelectTrigger className="h-12 rounded-2xl border-gray-100 font-bold text-gray-600 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl overflow-hidden border-gray-100 shadow-2xl">
                <SelectItem value={DOCUMENT_STATUS.DRAFT}>
                  {DOCUMENT_STATUS.DRAFT}
                </SelectItem>
                <SelectItem value={DOCUMENT_STATUS.APPROVED}>
                  {DOCUMENT_STATUS.APPROVED}
                </SelectItem>
                {userLevelCanCancelSales.includes(userLevel) && (
                  <SelectItem value={DOCUMENT_STATUS.CANCELED}>
                    {DOCUMENT_STATUS.CANCELED}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </MobileStickyBottomBar>
    </div>
  );
}
