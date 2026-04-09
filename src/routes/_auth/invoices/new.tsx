import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useZodForm } from "@/hooks/useZodForm";
import { useAuth } from "@/contexts/auth.context";
import { toast } from "sonner";
import ToastError from "@/components/toast/toast-error";

import { calculateInvoiceTotal } from "@/utils/invoice-calculator";
import { getDerivedCustomerInfo } from "@/utils/invoice-helpers";
import { useInvoiceMutations } from "./--hooks/useInvoiceMutations";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import type { PaymentSchemaType } from "@/schemas/payment.schema";

// Import Views
import NewInvoiceDesktopView from "./--components/NewInvoiceDesktopView";
import NewInvoiceMobileView from "./--components/NewInvoiceMobileView";
import {
  InvoiceFormProvider,
} from "./--components/context/InvoiceFormContext";
import { useInvoiceForm } from "./--hooks/useInvoiceForm";
import { useInvoiceContextBuilder } from "./--hooks/useInvoiceContextBuilder";
import InvoiceDialogContainer from "./--components/shared/InvoiceDialogContainer";
import ResponsiveInvoiceWrapper from "./--components/shared/ResponsiveInvoiceWrapper";
import { queryClient } from "@/query/queryClient";
import { itemMasterQueries } from "@/queries/item-master.queries";
import { itemMasterSearchInitialValue } from "@/interfaces/item-master.interface";
import { salesTakingPlaygroundViewInitialValue, type SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import { salesTakingSchema, salesTakingSchemaMapByPlayground, type SalesTakingSchemaType } from "@/schemas/sales-taking.schema";

const locationId = import.meta.env.VITE_LOCATION_ID as string;

export const Route = createFileRoute("/_auth/invoices/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");

  const {
    sales,
    setSales,
    salesDetail,
    setSalesDetail,
    selectedDetailId,
    setSelectedDetailId,
    detailErrors,
    dialogInvoiceItem,
    setDialogInvoiceItem,
    dialogItemMasterWithPrice,
    setDialogItemMasterWithPrice,
    dialogCustomer,
    setDialogCustomer,
    dialogPayment,
    setDialogPayment,
    shouldPrint,
    setShouldPrint,
    printRef,
    handleBarcodeSearch,
    handleClickSaveItem,
    handleKeyDown,
    inputsRef,
    setRef,
    handleChange,
  } = useInvoiceForm({
    refetchItemMasters: async () => {
      return queryClient.fetchQuery(
        itemMasterQueries.allWithPrice(
          {
            ...itemMasterSearchInitialValue,
            locationId,
            barcode: salesDetail.itemMasterBarcode,
          },
          {
            staleTime: 0,
            gcTime: 0,
          },
        ),
      );
    },
  });

  const { customerName, customerPhone } = getDerivedCustomerInfo(sales);

  const total = calculateInvoiceTotal(sales.salesTakingDetails);

  const { validate } = useZodForm(salesTakingSchema);
  const { errors } = useZodForm(salesTakingSchema);

  const { createMutation: saveSalesTaking } = useInvoiceMutations();

  const handleSave = async () => {
    const body: SalesTakingSchemaType = salesTakingSchemaMapByPlayground(
      sales,
      user,
      null,
    );

    body.locationId = locationId;

    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    try {
      const result = await saveSalesTaking.mutateAsync(body);

      navigate({
        to: "/invoices/$id",
        params: { id: result },
      });
    } catch (error: any) {
      // handled in generic hook
    }
  };

  const handlePayment = async (payment: PaymentSchemaType) => {
    const body: SalesTakingSchemaType = salesTakingSchemaMapByPlayground(
      sales,
      user,
      null,
    );
    body.docStatus = DOCUMENT_STATUS.APPROVED;
    body.payment = payment;
    body.locationId = locationId;

    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    try {
      const result = await saveSalesTaking.mutateAsync(body);
      setNumber(result);
      handleClickReset();
      setDialogPayment(false);
      setShouldPrint(true);
    } catch (error: any) {}
  };

  const handleClickReset = () => {
    setSales({
      ...salesTakingPlaygroundViewInitialValue,
    });
  };

  useEffect(() => {
    if (shouldPrint) {
      printRef?.current?.print();
      setShouldPrint(false);
    }
  }, [shouldPrint]);

  const contextValue = useInvoiceContextBuilder({
    invoiceForm: {
      sales,
      setSales,
      salesDetail,
      setSalesDetail,
      selectedDetailId,
      setSelectedDetailId,
      detailErrors,
      dialogInvoiceItem,
      setDialogInvoiceItem,
      dialogItemMasterWithPrice,
      setDialogItemMasterWithPrice,
      dialogCustomer,
      setDialogCustomer,
      dialogPayment,
      setDialogPayment,
      shouldPrint,
      setShouldPrint,
      printRef,
      inputsRef,
      setRef,
      handleChange,
      handleBarcodeSearch,
      handleClickSaveItem,
      handleKeyDown,
    },
    total,
    customerName,
    customerPhone,
    isPending: saveSalesTaking.isPending,
    status: DOCUMENT_STATUS.DRAFT,
    docStatus: DOCUMENT_STATUS.DRAFT,
    userLevelCanCancelSales: [],
    userLevel: "",
    errors,
    handleSave,
    handlePayment,
    deleteDetail: async (id: string) => {
      setSales((draft: SalesTakingPlaygroundView) => {
        const index = draft.salesTakingDetails.findIndex((d) => d.id === id);
        if (index !== -1) draft.salesTakingDetails.splice(index, 1);
      });
    },
    setStatus: () => {},
    handleClickReset,
    mode: "invoice",
  });

  return (
    <InvoiceFormProvider value={contextValue}>
      <div className="w-full min-h-screen bg-transparent">
        <ResponsiveInvoiceWrapper
          desktopView={<NewInvoiceDesktopView number={number} />}
          mobileView={<NewInvoiceMobileView number={number} />}
        />
        <InvoiceDialogContainer />
      </div>
    </InvoiceFormProvider>
  );
}
