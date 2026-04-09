import type { InvoiceFormContextType } from "../--components/context/InvoiceFormContext";
import type { useInvoiceForm } from "./useInvoiceForm";

interface UseInvoiceContextBuilderProps extends Partial<InvoiceFormContextType> {
  invoiceForm: ReturnType<typeof useInvoiceForm>;
}

export function useInvoiceContextBuilder({
  invoiceForm,
  ...extra
}: UseInvoiceContextBuilderProps): InvoiceFormContextType {
  const contextValue: InvoiceFormContextType = {
    // Spread invoiceForm values
    sales: invoiceForm.sales,
    setSales: invoiceForm.setSales,
    salesDetail: invoiceForm.salesDetail,
    setSalesDetail: invoiceForm.setSalesDetail,
    selectedDetailId: invoiceForm.selectedDetailId,
    setSelectedDetailId: invoiceForm.setSelectedDetailId,
    detailErrors: invoiceForm.detailErrors,
    dialogInvoiceItem: invoiceForm.dialogInvoiceItem,
    setDialogInvoiceItem: invoiceForm.setDialogInvoiceItem,
    dialogItemMasterWithPrice: invoiceForm.dialogItemMasterWithPrice,
    setDialogItemMasterWithPrice: invoiceForm.setDialogItemMasterWithPrice,
    dialogCustomer: invoiceForm.dialogCustomer,
    setDialogCustomer: invoiceForm.setDialogCustomer,
    dialogPayment: invoiceForm.dialogPayment,
    setDialogPayment: invoiceForm.setDialogPayment,
    inputsRef: invoiceForm.inputsRef,
    printRef: invoiceForm.printRef,
    setRef: invoiceForm.setRef,
    handleChange: invoiceForm.handleChange,
    handleBarcodeSearch: invoiceForm.handleBarcodeSearch,
    handleClickSaveItem: invoiceForm.handleClickSaveItem,
    handleKeyDown: invoiceForm.handleKeyDown,

    // Values from extra
    total: extra.total ?? 0,
    customerName: extra.customerName ?? "",
    customerPhone: extra.customerPhone ?? "",
    isPending: extra.isPending ?? false,
    status: extra.status!,
    docStatus: extra.docStatus!,
    userLevelCanCancelSales: extra.userLevelCanCancelSales ?? [],
    userLevel: extra.userLevel ?? "",
    errors: extra.errors ?? {},
    handleSave: extra.handleSave!,
    handlePayment: extra.handlePayment,
    deleteDetail: extra.deleteDetail,
    setStatus: extra.setStatus!,
    handleClickReset: extra.handleClickReset,
    mode: extra.mode ?? "invoice",
  };

  return contextValue;
}
