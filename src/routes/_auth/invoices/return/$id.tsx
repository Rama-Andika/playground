import {
  DOCUMENT_STATUS,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { InvoiceFormProvider } from "../--components/context/InvoiceFormContext";
import EditReturnDesktopView from "./--components/EditReturnDesktopView";
import EditReturnMobileView from "./--components/EditReturnMobileView";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { queryClient } from "@/query/queryClient";
import { salesTakingQueries } from "@/queries/sales-taking.queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useZodForm } from "@/hooks/useZodForm";
import {
  salesTakingSchema,
  salesTakingSchemaMapByPlayground,
  type SalesTakingSchemaType,
} from "@/schemas/sales-taking.schema";
import { calculateInvoiceTotal } from "@/utils/invoice-calculator";
import { getDerivedCustomerInfo } from "@/utils/invoice-helpers";
import { useInvoiceMutations } from "../--hooks/useInvoiceMutations";
import { useAuth } from "@/contexts/auth.context";
import { toast } from "sonner";
import ToastError from "@/components/toast/toast-error";
import {
  salesTakingPlaygroundViewInitialValue,
} from "@/interfaces/sales-taking.interface";
import { useInvoiceForm } from "../--hooks/useInvoiceForm";
import { useInvoiceContextBuilder } from "../--hooks/useInvoiceContextBuilder";
import InvoiceDialogContainer from "../--components/shared/InvoiceDialogContainer";
import ResponsiveInvoiceWrapper from "../--components/shared/ResponsiveInvoiceWrapper";
import type { PaymentSchemaType } from "@/schemas/payment.schema";
import { systemMainQueries } from "@/queries/system-main.queries";

export const Route = createFileRoute("/_auth/invoices/return/$id")({
  loader: async ({ params }) => {
    const { id } = params;
    return queryClient.ensureQueryData(
      salesTakingQueries.salesPlaygroundByNumber(id),
    );
  },
  component: RouteComponent,
  staticData: {
    breadcrumb: () => "Invoice Return",
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const userLevel = user?.level?.toString() ?? "";

  const { data } = useSuspenseQuery(
    salesTakingQueries.salesPlaygroundByNumber(id),
  );
  const docStatus =
    (data?.docStatus as DocumentStatusType) ?? DOCUMENT_STATUS.DRAFT;

  const { data: systemMain } = useQuery(
    systemMainQueries.systemMain("USER_LEVEL_SALES_CANCELED_PLAYGROUND"),
  );

  const userLevelCanCancelSales: string[] =
    systemMain?.valueprop.split(",") ?? [];

  const [status, setStatus] = useState<DocumentStatusType>(docStatus);

  const {
    sales,
    setSales,
    salesDetail,
    setSalesDetail,
    dialogInvoiceItem,
    setDialogInvoiceItem,
    dialogPayment,
    setDialogPayment,
    dialogCustomer,
    setDialogCustomer,
    dialogItemMasterWithPrice,
    setDialogItemMasterWithPrice,
    selectedDetailId,
    setSelectedDetailId,
    detailErrors,
    handleBarcodeSearch,
    handleClickSaveItem,
    handleKeyDown,
    inputsRef,
    printRef,
    setRef,
    shouldPrint,
    setShouldPrint,
    handleChange,
  } = useInvoiceForm({
    initialData: data ?? salesTakingPlaygroundViewInitialValue,
    refetchItemMasters: async () => {},
  });

  const total = calculateInvoiceTotal(sales.salesTakingDetails, true);

  const { customerName, customerPhone } = getDerivedCustomerInfo(sales);

  const { validate } = useZodForm(salesTakingSchema);

  const { updateReturnMutation: updateSalesTaking } = useInvoiceMutations();

  const handleSave = async () => {
    if (status === DOCUMENT_STATUS.APPROVED) {
      toast(<ToastError message="Cannot save approved return." />);
      return;
    }

    const body: SalesTakingSchemaType = salesTakingSchemaMapByPlayground(
      sales,
      user,
      null,
    );

    body.docStatus = status;

    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    try {
      await updateSalesTaking.mutateAsync({
        id: sales?.id ?? "",
        body,
        number: id,
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

    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    try {
      await updateSalesTaking.mutateAsync({
        id: sales?.id ?? "",
        body,
        number: id,
      });
      setDialogPayment(false);
      setShouldPrint(true);
    } catch (error: any) {
      // handled in generic hook
    }
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
      dialogInvoiceItem,
      setDialogInvoiceItem,
      dialogPayment,
      setDialogPayment,
      dialogCustomer,
      setDialogCustomer,
      dialogItemMasterWithPrice,
      setDialogItemMasterWithPrice,
      selectedDetailId,
      setSelectedDetailId,
      detailErrors,
      handleBarcodeSearch,
      handleClickSaveItem,
      handleKeyDown,
      inputsRef,
      printRef,
      setRef,
      shouldPrint,
      setShouldPrint,
      handleChange,
    },
    total,
    customerName,
    customerPhone,
    isPending: updateSalesTaking.isPending,
    status,
    docStatus,
    userLevelCanCancelSales,
    userLevel,
    errors: {},
    handleSave,
    handlePayment,
    deleteDetail: async () => {},
    setStatus,
    mode: "return-edit",
  });

  return (
    <InvoiceFormProvider value={contextValue}>
      <div className="w-full min-h-screen bg-transparent">
        <ResponsiveInvoiceWrapper
          desktopView={<EditReturnDesktopView />}
          mobileView={<EditReturnMobileView />}
        />
        <InvoiceDialogContainer />
      </div>
    </InvoiceFormProvider>
  );
}

