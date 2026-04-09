import {
  DOCUMENT_STATUS,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { salesTakingDetailPlaygroundViewInitialValue } from "@/interfaces/sales-taking-detail.interface";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { IoReturnDownBackOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceMobileHeader } from "./shared/InvoiceMobileHeader";
import { InvoiceInfoCard } from "./shared/InvoiceInfoCard";
import { MobileInvoiceItemList } from "./shared/MobileInvoiceItemList";
import { MobileStickyBottomBar } from "./shared/MobileStickyBottomBar";
import { Card, CardContent } from "@/components/ui/card";
import { LuPencil } from "react-icons/lu";
import { useInvoiceContext } from "./context/InvoiceFormContext";
import SmallInvoice from "./print/small-invoice.print";
import InvoiceMobileLayout from "./shared/InvoiceMobileLayout";

export default function EditInvoiceMobileView() {
  const {
    sales,
    total,
    customerName,
    customerPhone,
    isPending,
    docStatus,
    userLevel,
    userLevelCanCancelSales,
    setDialogCustomer,
    setDialogInvoiceItem,
    setSalesDetail,
    deleteDetail,
    handleSave,
    status,
    setStatus,
    printRef,
  } = useInvoiceContext();
  const isDraft = docStatus === DOCUMENT_STATUS.DRAFT;

  return (
    <InvoiceMobileLayout
      header={
        <InvoiceMobileHeader
          title={sales?.number || "Loading..."}
          status={docStatus as DocumentStatusType}
        >
          <SmallInvoice id={sales.number ?? ""} ref={printRef ?? null} />
          {docStatus === DOCUMENT_STATUS.APPROVED && (
            <Link
              to="/invoices/return/new/$id"
              params={{ id: sales.number ?? "" }}
            >
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 border-amber-200 text-amber-500 rounded-xl"
              >
                <IoReturnDownBackOutline size={20} />
              </Button>
            </Link>
          )}
        </InvoiceMobileHeader>
      }
      infoCard={<InvoiceInfoCard number={sales?.number} date={sales?.date} />}
      content={
        <MobileInvoiceItemList
          sales={sales}
          isDraft={isDraft}
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

          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-5">
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
                    className="h-9 w-9 text-orange-500 hover:bg-orange-50 rounded-xl"
                  >
                    <LuPencil size={14} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      }
      bottomBar={
        <MobileStickyBottomBar
          total={total}
          isPending={isPending}
          isDraft={isDraft}
          handleSave={handleSave}
        >
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
        </MobileStickyBottomBar>
      }
    />
  );
}
