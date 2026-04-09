import React, { useState, useRef, useEffect } from "react";
import { useImmer } from "use-immer";
import { toast } from "sonner";
import {
  salesTakingDetailPlaygroundViewInitialValue,
  type SalesTakingDetailPlaygroundView,
} from "@/interfaces/sales-taking-detail.interface";
import {
  salesTakingPlaygroundViewInitialValue,
  type SalesTakingPlaygroundView,
} from "@/interfaces/sales-taking.interface";
import {
  salesTakingDetailSchema,
  salesTakingDetailSchemaMap,
} from "@/schemas/sales-taking-detail.schema";
import { toValidNumber } from "@/utils/to-valid-number";
import ToastError from "@/components/toast/toast-error";
import type { SmallInvoiceRef } from "../--components/print/small-invoice.print";
import { useZodForm } from "@/hooks/useZodForm";

interface UseInvoiceFormProps {
  initialData?: SalesTakingPlaygroundView;
  refetchItemMasters: (barcode: string) => Promise<any>;
  onSaveItemSuccess?: () => void;
}

export function useInvoiceForm({
  initialData,
  refetchItemMasters,
  onSaveItemSuccess,
}: UseInvoiceFormProps) {
  const [sales, setSales] = useImmer<SalesTakingPlaygroundView>(
    initialData ?? salesTakingPlaygroundViewInitialValue,
  );

  useEffect(() => {
    if (initialData) {
      setSales(initialData);
    }
  }, [initialData, setSales]);

  const [salesDetail, setSalesDetail] =
    useImmer<SalesTakingDetailPlaygroundView>(
      salesTakingDetailPlaygroundViewInitialValue(),
    );
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [dialogCustomer, setDialogCustomer] = useState(false);
  const [dialogInvoiceItem, setDialogInvoiceItem] = useState(false);
  const [dialogItemMasterWithPrice, setDialogItemMasterWithPrice] =
    useState(false);
  const [dialogPayment, setDialogPayment] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const printRef = useRef<SmallInvoiceRef>(null);

  const setRef = (el: HTMLInputElement | null, index: number) => {
    if (el) {
      inputsRef.current[index] = el;
    }
  };

  const { errors: detailErrors, validate } = useZodForm(salesTakingDetailSchema);

  const handleChange = <K extends keyof SalesTakingDetailPlaygroundView>(
    key: K,
    value: SalesTakingDetailPlaygroundView[K],
  ) => {
    if (key === "itemMasterBarcode") {
      setSalesDetail({
        ...salesTakingDetailPlaygroundViewInitialValue(),
        itemMasterBarcode: value as string,
      });
      return;
    }

    setSalesDetail((draft) => {
      if (key === "discountItemPercent" && (value as number) > 100) return;
      if (key === "discountItem" && (value as number) > draft.price * draft.qty)
        return;

      if (key === "discountItemPercent") {
        draft.discountItem =
          (draft.price * draft.qty * (value as number)) / 100;
      }
      if (key === "discountItem") {
        draft.discountItemPercent =
          ((value as number) / (draft.price * draft.qty)) * 100;
      }
      draft[key] = value;
      draft.total = draft.price * draft.qty - draft.discountItem;
    });
  };

  const handleBarcodeSearch = async () => {
    const result = await refetchItemMasters(salesDetail.itemMasterBarcode);
    const data = result?.data ?? [];

    if (data?.length === 0) {
      toast(<ToastError message="Data not found!" />);
      inputsRef.current[0]?.focus();
      setSalesDetail(salesTakingDetailPlaygroundViewInitialValue());
    } else if (data?.length === 1) {
      const itemMaster = data?.[0];
      setSalesDetail((draft) => {
        draft.itemMasterId = itemMaster.itemId;
        draft.itemMasterBarcode = itemMaster.barcode;
        draft.itemMasterName = itemMaster.itemName;
        draft.price = toValidNumber(itemMaster.price);
        draft.convQty = toValidNumber(itemMaster.convQty);
        draft.uomId = itemMaster.uomId ?? "";
        draft.qty = 1;
        draft.total = draft.price * draft.qty;
      });
      setTimeout(() => {
        inputsRef.current[3]?.focus();
      }, 100);
    } else if (data?.length > 1) {
      setDialogItemMasterWithPrice(true);
      inputsRef.current[0]?.focus();
    }
  };

  const handleClickSaveItem = () => {
    const body = salesTakingDetailSchemaMap(salesDetail);
    if (!validate(body)) return;

    if (salesDetail.total < 0) {
      toast(<ToastError message="Total cannot be negative." />);
      return;
    }

    setSales((draft) => {
      const temp = { ...salesDetail };
      const index = draft.salesTakingDetails.findIndex((d) => d.id === temp.id);
      if (index !== -1) {
        draft.salesTakingDetails[index] = temp;
      } else {
        draft.salesTakingDetails.push(temp);
      }
    });

    setSalesDetail(salesTakingDetailPlaygroundViewInitialValue());
    setSelectedDetailId(null);
    setDialogInvoiceItem(false);
    inputsRef.current[0]?.focus();
    onSaveItemSuccess?.();
  };

  const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === " " || e.keyCode === 32) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" || e.keyCode === 13) {
      if (inputsRef.current[index + 1]?.disabled) {
        inputsRef.current[index + 2]?.focus();
        return;
      }
      if (index === 0 && salesDetail.itemMasterBarcode.length > 0) {
        handleBarcodeSearch();
        return;
      }
      if (index === 1) {
        setDialogItemMasterWithPrice(true);
        return;
      }
      if (index === 5) {
        handleClickSaveItem();
        return;
      }
      inputsRef.current[index + 1]?.focus();
    }

    if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      if (index === 0) return;

      if (inputsRef.current[index - 1]?.disabled) {
        inputsRef.current[index - 2]?.focus();
        return;
      }
      if (index - 1 === 0) {
        setSalesDetail(salesTakingDetailPlaygroundViewInitialValue());
      }
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "F9" || e.keyCode === 120) {
      e.preventDefault();
      setDialogPayment(true);
    }
  };

  return {
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
  };
}

