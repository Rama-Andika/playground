import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import { InvoiceFormProvider } from "../../--components/context/InvoiceFormContext";
import NewReturnDesktopView from "../--components/NewReturnDesktopView";
import NewReturnMobileView from "../--components/NewReturnMobileView";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryClient } from "@/query/queryClient";
import { salesTakingQueries } from "@/queries/sales-taking.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useZodForm } from "@/hooks/useZodForm";
import {
  salesTakingSchema,
  salesTakingSchemaMapByPlayground,
  type SalesTakingSchemaType,
} from "@/schemas/sales-taking.schema";
import { calculateInvoiceTotal } from "@/utils/invoice-calculator";
import { getDerivedCustomerInfo } from "@/utils/invoice-helpers";
import { useInvoiceMutations } from "../../--hooks/useInvoiceMutations";
import { useAuth } from "@/contexts/auth.context";
import { toast } from "sonner";
import ToastError from "@/components/toast/toast-error";
import {
  salesTakingPlaygroundViewInitialValue,
  type SalesTakingPlaygroundView,
} from "@/interfaces/sales-taking.interface";
import { useInvoiceForm } from "../../--hooks/useInvoiceForm";
import { useInvoiceContextBuilder } from "../../--hooks/useInvoiceContextBuilder";
import InvoiceDialogContainer from "../../--components/shared/InvoiceDialogContainer";
import ResponsiveInvoiceWrapper from "../../--components/shared/ResponsiveInvoiceWrapper";

export const Route = createFileRoute("/_auth/invoices/return/new/$id")({
  loader: async ({ params }) => {
    const { id } = params;
    return queryClient.ensureQueryData(
      salesTakingQueries.salesPlaygroundByNumber(id),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data } = useSuspenseQuery(
    salesTakingQueries.salesPlaygroundByNumber(id),
  );

  const {
    sales,
    setSales,
    salesDetail,
    setSalesDetail,
    dialogInvoiceItem,
    setDialogInvoiceItem,
    dialogCustomer,
    setDialogCustomer,
    dialogPayment,
    setDialogPayment,
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

  const { createReturnMutation: saveSalesTaking } = useInvoiceMutations();

  const handleSave = async () => {
    const body: SalesTakingSchemaType = salesTakingSchemaMapByPlayground(
      sales,
      user,
      null,
    );

    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    body.salesTakingDetails = sales.salesTakingDetails.filter(
      (d) => d.qtyReturn > 0,
    );

    if (body.salesTakingDetails.length === 0) {
      toast(<ToastError message="Cannot return empty invoice." />);
      return;
    }

    try {
      const number = await saveSalesTaking.mutateAsync({
        id: sales?.id ?? "",
        body,
      });
      navigate({
        to: "/invoices/return/$id",
        params: { id: number ?? "" },
        replace: true,
      });
    } catch (error: any) {
      // handled in generic hook
    }
    queryClient.invalidateQueries({
      queryKey: salesTakingQueries.salesPlaygroundByNumber(id).queryKey,
    });
  };

  const contextValue = useInvoiceContextBuilder({
    invoiceForm: {
      sales,
      setSales,
      salesDetail,
      setSalesDetail,
      dialogInvoiceItem,
      setDialogInvoiceItem,
      dialogCustomer,
      setDialogCustomer,
      dialogPayment,
      setDialogPayment,
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
    isPending: saveSalesTaking.isPending,
    status: DOCUMENT_STATUS.DRAFT as any,
    docStatus: DOCUMENT_STATUS.DRAFT as any,
    userLevelCanCancelSales: [],
    userLevel: "",
    errors: {},
    handleSave,
    deleteDetail: async (id: string) => {
      setSales((draft: SalesTakingPlaygroundView) => {
        const index = draft.salesTakingDetails.findIndex((d) => d.id === id);
        if (index !== -1) draft.salesTakingDetails.splice(index, 1);
      });
    },
    setStatus: () => {},
    mode: "return",
  });

  return (
    <InvoiceFormProvider value={contextValue}>
      <div className="w-full min-h-screen bg-gray-50/50">
        <ResponsiveInvoiceWrapper
          desktopView={<NewReturnDesktopView />}
          mobileView={<NewReturnMobileView />}
        />
        <InvoiceDialogContainer />
      </div>
    </InvoiceFormProvider>
  );
}

