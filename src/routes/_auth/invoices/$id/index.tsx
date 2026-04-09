import { useEffect, useState } from "react";
import { queryClient } from "@/query/queryClient";
import { salesTakingQueries } from "@/queries/sales-taking.queries";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useZodForm } from "@/hooks/useZodForm";
import {
  salesTakingSchema,
  salesTakingSchemaMapByPlayground,
  type SalesTakingSchemaType,
} from "@/schemas/sales-taking.schema";
import { useAuth } from "@/contexts/auth.context";
import { toast } from "sonner";
import ToastError from "@/components/toast/toast-error";
import { systemMainQueries } from "@/queries/system-main.queries";
import { calculateInvoiceTotal } from "@/utils/invoice-calculator";
import { getDerivedCustomerInfo } from "@/utils/invoice-helpers";
import { useInvoiceMutations } from "../--hooks/useInvoiceMutations";
import { createFileRoute } from "@tanstack/react-router";
import {
  DOCUMENT_STATUS,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import type { PaymentSchemaType } from "@/schemas/payment.schema";

// Import Views
import EditInvoiceDesktopView from "../--components/EditInvoiceDesktopView";
import EditInvoiceMobileView from "../--components/EditInvoiceMobileView";
import { InvoiceFormProvider } from "../--components/context/InvoiceFormContext";
import { useInvoiceForm } from "../--hooks/useInvoiceForm";
import { useInvoiceContextBuilder } from "../--hooks/useInvoiceContextBuilder";
import InvoiceDialogContainer from "../--components/shared/InvoiceDialogContainer";
import ResponsiveInvoiceWrapper from "../--components/shared/ResponsiveInvoiceWrapper";
import { itemMasterQueries } from "@/queries/item-master.queries";
import { itemMasterSearchInitialValue } from "@/interfaces/item-master.interface";
import {
  deleteSalesTakingDetails,
  getSalesTakingDetailById,
} from "@/api/sales-taking-detail.api";
import { salesTakingPlaygroundViewInitialValue } from "@/interfaces/sales-taking.interface";

const locationId = import.meta.env.VITE_LOCATION_ID;

export const Route = createFileRoute("/_auth/invoices/$id/")({
  loader: async ({ params }) => {
    const { id } = params;
    return queryClient.ensureQueryData(
      salesTakingQueries.salesPlaygroundByNumber(id),
    );
  },
  component: RouteComponent,
  staticData: {
    breadcrumb: "Invoice",
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
  const [deletedSalesTakingDetailIds, setDeletedSalesTakingDetailIds] =
    useState<string[]>([]);

  const {
    sales,
    setSales,
    salesDetail,
    setSalesDetail,
    selectedDetailId,
    setSelectedDetailId,
    dialogInvoiceItem,
    setDialogInvoiceItem,
    dialogItemMasterWithPrice,
    setDialogItemMasterWithPrice,
    dialogPayment,
    setDialogPayment,
    dialogCustomer,
    setDialogCustomer,
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

  const { updateMutation: updateSalesTaking } = useInvoiceMutations();

  const handleSave = async () => {
    if (status === DOCUMENT_STATUS.APPROVED) {
      setDialogPayment(true);
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
      if (deletedSalesTakingDetailIds.length > 0) {
        await deleteSalesTakingDetails(deletedSalesTakingDetailIds);
      }
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
      if (deletedSalesTakingDetailIds.length > 0) {
        await deleteSalesTakingDetails(deletedSalesTakingDetailIds);
      }
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

  const handleDeleteDetail = async (detailId: string) => {
    try {
      await getSalesTakingDetailById(detailId);
      setDeletedSalesTakingDetailIds((prev) => [...prev, detailId]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setSales((draft) => {
        const index = draft.salesTakingDetails.findIndex(
          (d) => d.id === detailId,
        );
        if (index !== -1) draft.salesTakingDetails.splice(index, 1);
      });
    }
  };

  useEffect(() => {
    if (shouldPrint) {
      printRef?.current?.print();
      setShouldPrint(false);
    }
  }, [shouldPrint]);

  const { errors } = useZodForm(salesTakingSchema);

  const contextValue = useInvoiceContextBuilder({
    invoiceForm: {
      sales,
      setSales,
      salesDetail,
      setSalesDetail,
      selectedDetailId,
      setSelectedDetailId,
      dialogInvoiceItem,
      setDialogInvoiceItem,
      dialogItemMasterWithPrice,
      setDialogItemMasterWithPrice,
      dialogPayment,
      setDialogPayment,
      dialogCustomer,
      setDialogCustomer,
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
    errors,
    handleSave,
    handlePayment,
    deleteDetail: handleDeleteDetail,
    setStatus,
    mode: "invoice",
  });

  return (
    <InvoiceFormProvider value={contextValue}>
      <div className="w-full min-h-screen bg-transparent">
        <ResponsiveInvoiceWrapper
          desktopView={<EditInvoiceDesktopView />}
          mobileView={<EditInvoiceMobileView />}
        />
        <InvoiceDialogContainer />
      </div>
    </InvoiceFormProvider>
  );
}

