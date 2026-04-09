import { useMutation } from "@tanstack/react-query";
import {
  salesTakingNew,
  salesTakingUpdate,
  salesTakingNewReturn,
  salesTakingUpdateReturn,
} from "@/api/sales-taking.api";
import { deleteSalesTakingDetail } from "@/api/sales-taking-detail.api";
import { queryClient } from "@/query/queryClient";
import { salesTakingQueries } from "@/queries/sales-taking.queries";
import { toast } from "sonner";
import ToastSuccess from "@/components/toast/toast-success";
import ToastError from "@/components/toast/toast-error";
import getErrorMessage from "@/utils/error-message";
import type { SalesTakingSchemaType } from "@/schemas/sales-taking.schema";

export const useInvoiceMutations = () => {
  const createMutation = useMutation({
    mutationFn: (body: SalesTakingSchemaType) => salesTakingNew(body),
    onSuccess: (data) => {
      toast(<ToastSuccess message="Save successfully!" />);
      return data;
    },
    onError: (error: any) => {
      toast(<ToastError message={getErrorMessage(error)} />);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: SalesTakingSchemaType;
      number: string;
    }) => salesTakingUpdate(id, body),
    onSuccess: (_, { number }) => {
      toast(<ToastSuccess message="Update successfully!" />);
      queryClient.invalidateQueries({
        queryKey: salesTakingQueries.salesPlaygroundByNumber(number).queryKey,
      });
    },
    onError: (error: any) => {
      toast(<ToastError message={getErrorMessage(error)} />);
    },
  });

  const createReturnMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: SalesTakingSchemaType }) =>
      salesTakingNewReturn(id, body),
    onSuccess: () => {
      toast(<ToastSuccess message="Save successfully!" />);
    },
    onError: (error: any) => {
      toast(<ToastError message={getErrorMessage(error)} />);
    },
  });

  const updateReturnMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: SalesTakingSchemaType;
      number: string;
    }) => salesTakingUpdateReturn(id, body),
    onSuccess: (_, { number }) => {
      toast(<ToastSuccess message="Update successfully!" />);
      queryClient.invalidateQueries({
        queryKey: salesTakingQueries.salesPlaygroundByNumber(number).queryKey,
      });
    },
    onError: (error: any) => {
      toast(<ToastError message={getErrorMessage(error)} />);
    },
  });

  const deleteDetailMutation = useMutation({
    mutationFn: (id: string) => deleteSalesTakingDetail(id),
    onError: (error: any) => {
      toast(<ToastError message={getErrorMessage(error)} />);
    },
  });

  return {
    createMutation,
    updateMutation,
    createReturnMutation,
    updateReturnMutation,
    deleteDetailMutation,
  };
};
