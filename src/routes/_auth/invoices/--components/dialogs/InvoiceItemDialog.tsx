import { toast } from "sonner";
import ButtonSave from "@/components/button/ButtonSave";
import ButtonSearch from "@/components/button/ButtonSearch";
import ToastError from "@/components/toast/toast-error";
import { formatNumberWithDecimals } from "@/utils/format-number";
import { toValidNumber } from "@/utils/to-valid-number";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useZodForm } from "@/hooks/useZodForm";
import type { SalesTakingDetailPlaygroundView } from "@/interfaces/sales-taking-detail.interface";
import {
  salesTakingDetailSchema,
  salesTakingDetailSchemaMap,
} from "@/schemas/sales-taking-detail.schema";
import { calculateDetailTotal } from "@/utils/invoice-calculator";

import { useInvoiceContext } from "../context/InvoiceFormContext";

const InvoiceItemDialog = () => {
  const {
    dialogInvoiceItem: open,
    setDialogInvoiceItem: setOpen,
    setDialogItemMasterWithPrice: setOpenDialogItemMaster,
    salesDetail,
    setSalesDetail,
    setSales,
    mode = "invoice",
  } = useInvoiceContext();

  if (!open) return null;

  const isReturn = mode === "return" || mode === "return-edit";
  const total = calculateDetailTotal(salesDetail, isReturn);

  const handleChange = <K extends keyof SalesTakingDetailPlaygroundView>(
    key: K,
    value: SalesTakingDetailPlaygroundView[K],
  ) => {
    if (key === "discountItemPercent" && (value as number) > 100) return;

    setSalesDetail((draft) => {
      draft[key] = value;

      if (key === "discountItemPercent") {
        draft.discountItem =
          (draft.price * draft.qty * (value as number)) / 100;
        return;
      }

      if (key === "discountItem") {
        draft.discountItemPercent =
          ((value as number) / (draft.price * draft.qty)) * 100;
        return;
      }

      // Recalculate discount based on current percent if price/qty changes
      draft.discountItemPercent =
        (draft.discountItem / (draft.price * draft.qty)) * 100;

      if (
        isNaN(draft.discountItemPercent) ||
        !isFinite(draft.discountItemPercent)
      )
        draft.discountItemPercent = 0;

      draft.total = calculateDetailTotal(draft as any, isReturn);
    });
  };

  const { errors, validate } = useZodForm(salesTakingDetailSchema);

  const handleSave = () => {
    const body = salesTakingDetailSchemaMap(salesDetail);
    if (!validate(body)) {
      toast(<ToastError message="Please fill in the required fields." />);
      return;
    }

    if (mode === "return") {
      if (salesDetail.qtyReturn > salesDetail.qty - salesDetail.prevReturn) {
        toast(
          <ToastError message="Return quantity cannot be greater than the available quantity." />,
        );
        return;
      }
    }
    if (total < 0) {
      toast(<ToastError message="Total cannot be negative." />);
      return;
    }

    setSales((draft) => {
      let temp: SalesTakingDetailPlaygroundView = { ...salesDetail };
      if (mode === "return-edit") {
        temp = {
          ...salesDetail,
          discountItem:
            (salesDetail.discountItem / salesDetail.qty) *
            salesDetail.qtyReturn,
          qty: salesDetail.qtyReturn,
        };
      } else {
        temp = { ...salesDetail };
      }
      temp.total = total;

      const index = draft.salesTakingDetails.findIndex((d) => d.id === temp.id);
      if (index !== -1) {
        draft.salesTakingDetails[index] = temp;
      } else {
        draft.salesTakingDetails.push(temp);
      }
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent
        onInteractOutside={(e) => {
          if (isReturn) return; // Allow close for return dialog
          e.preventDefault();
        }}
        className="max-w-md rounded-[2.5rem]"
      >
        <DialogHeader className="pt-2">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isReturn ? "Return Item Detail" : "Invoice Item Detail"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          {/* Item Section */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
              Item Name
            </Label>
            <ButtonGroup className="w-full">
              <Input
                disabled
                value={salesDetail.itemMasterName}
                className="rounded-2xl bg-gray-50 border-gray-100 font-medium"
              />
              {!isReturn && setOpenDialogItemMaster && (
                <ButtonSearch
                  onClick={() => setOpenDialogItemMaster(true)}
                  className="w-fit! h-10! rounded-xl"
                />
              )}
            </ButtonGroup>
            {errors.itemMasterId && (
              <FieldError>{errors.itemMasterId}</FieldError>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Section */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                Price
              </Label>
              <Input
                disabled={isReturn}
                value={formatNumberWithDecimals(salesDetail.price)}
                onChange={(e) =>
                  handleChange("price", toValidNumber(e.target.value))
                }
                className="rounded-2xl border-gray-100 focus:ring-main h-11"
              />
            </div>

            {/* Qty Section */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                Quantity
              </Label>
              <Input
                disabled={isReturn}
                value={salesDetail.qty}
                onChange={(e) =>
                  handleChange("qty", toValidNumber(e.target.value))
                }
                className="rounded-2xl border-gray-100 focus:ring-main h-11"
              />
            </div>
          </div>

          {/* Discount Section */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
              Discount
            </Label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Input
                  disabled={isReturn}
                  value={formatNumberWithDecimals(
                    salesDetail.discountItemPercent,
                  )}
                  onChange={(e) =>
                    handleChange(
                      "discountItemPercent",
                      toValidNumber(e.target.value),
                    )
                  }
                  className="rounded-2xl border-gray-100 focus:ring-main h-11 pr-8 text-right"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                  %
                </span>
              </div>
              <div className="relative flex-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                  Rp
                </span>
                <Input
                  disabled={isReturn}
                  value={formatNumberWithDecimals(salesDetail.discountItem)}
                  onChange={(e) =>
                    handleChange("discountItem", toValidNumber(e.target.value))
                  }
                  className="rounded-2xl border-gray-100 focus:ring-main h-11 pl-8 text-right"
                />
              </div>
            </div>
          </div>

          {isReturn && (
            <div className="space-y-2 bg-main/5 p-4 rounded-3xl border border-main/10 animate-in zoom-in-95 duration-300">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-main ml-1">
                Quantity to Return
              </Label>
              <Input
                value={salesDetail.qtyReturn}
                autoFocus
                onChange={(e) =>
                  handleChange("qtyReturn", toValidNumber(e.target.value))
                }
                className="rounded-2xl border-main/20 focus:ring-main h-12 text-lg font-black text-main text-center bg-white shadow-inner"
              />
              {mode === "return" && (
                <p className="text-[10px] text-gray-400 text-center font-medium mt-1">
                  Available: {salesDetail.qty - (salesDetail.prevReturn || 0)}{" "}
                  items
                </p>
              )}
            </div>
          )}

          {/* Total Section */}
          <div className="mt-2 p-5 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Subtotal
            </span>
            <span className="text-2xl font-black text-gray-800 tracking-tighter">
              Rp {formatNumberWithDecimals(total)}
            </span>
          </div>

          <div className="flex justify-end mt-2">
            <ButtonSave onClick={handleSave} className="w-full h-12" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceItemDialog;
