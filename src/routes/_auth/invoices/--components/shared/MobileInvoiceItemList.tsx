import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumberWithDecimals } from "@/utils/format-number";
import ButtonIconPencil from "@/components/button/icon/ButtonIconPencil";
import ButtonIconTrash from "@/components/button/icon/ButtonIconTrash";
import { AlertDialogConfirmationDelete } from "@/components/alert-dialog/alert-dialog-confirmation-delete";
import type { SalesTakingDetailPlaygroundView } from "@/interfaces/sales-taking-detail.interface";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";

interface MobileInvoiceItemListProps {
  sales: SalesTakingPlaygroundView;
  isDraft: boolean;
  onEditItem: (detail: SalesTakingDetailPlaygroundView) => void;
  onDeleteItem?: (id: string) => void;
  onAddItem?: () => void;
  emptyMessage?: string;
  title?: string;
  mode?: "invoice" | "return" | "return-edit";
}

export const MobileInvoiceItemList = ({
  sales,
  isDraft,
  onEditItem,
  onDeleteItem,
  onAddItem,
  emptyMessage = "No items in this invoice.",
  title = "Purchased Items",
  mode = "invoice",
}: MobileInvoiceItemListProps) => {
  const isReturn = mode === "return" || mode === "return-edit";
  const items = sales?.salesTakingDetails || [];

  return (
    <div className="space-y-4">
      {/* Item List Header */}
      <div className="flex items-center justify-between px-1 pt-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-main" />
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {isReturn ? "Items to Return" : title}
          </h2>
          <span className="bg-main/10 text-main text-[10px] font-bold px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        {isDraft && !isReturn && (
          <Button
            size="sm"
            variant="ghost"
            className="text-main font-bold hover:bg-main/5 px-3 rounded-xl h-8 active:scale-95 transition-all"
            onClick={() => onAddItem?.()}
          >
            Add +
          </Button>
        )}
      </div>

      {/* Item Cards */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-gray-400 italic text-sm bg-white rounded-3xl border border-dashed border-gray-100">
            {emptyMessage}
          </div>
        ) : (
          items.map((detail) => (
            <Card
              key={detail.id}
              className="rounded-2xl border-gray-50 shadow-sm overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono text-gray-400">
                        {detail.itemMasterBarcode}
                      </span>
                      <h3 className="font-bold text-gray-700 text-sm leading-tight">
                        {detail.itemMasterName}
                      </h3>
                    </div>
                    {isDraft && (
                      <div className="flex items-center gap-1">
                        <ButtonIconPencil
                          onClick={() => onEditItem(detail)}
                          className="bg-gray-50 hover:bg-main/5 text-gray-400 hover:text-main rounded-lg"
                        />
                        {!isReturn && sales.salesTakingDetails.length > 1 && (
                          <AlertDialogConfirmationDelete
                            onClickDelete={() => onDeleteItem?.(detail.id)}
                          >
                            <ButtonIconTrash className="bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg" />
                          </AlertDialogConfirmationDelete>
                        )}
                      </div>
                    )}
                  </div>
                  <Separator className="bg-gray-50/50" />

                  {isReturn && mode === "return" ? (
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                          Original Qty
                        </span>
                        <p className="text-xs font-medium text-gray-600">
                          {detail.qty} items
                        </p>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                          Price ea.
                        </span>
                        <p className="text-xs font-medium text-gray-600">
                          Rp {formatNumberWithDecimals(detail.price)}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                          Prev Return
                        </span>
                        <p className="text-xs font-medium text-gray-400 italic">
                          {detail.prevReturn || 0} items
                        </p>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-main uppercase font-bold tracking-tighter">
                          Qty Return
                        </span>
                        <p className="text-sm font-bold text-main">
                          {detail.qtyReturn || 0} items
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end justify-between mt-1">
                      <div className="flex flex-col">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                          Price ea. x Qty
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-sm font-bold text-gray-800">
                            Rp {formatNumberWithDecimals(detail.price)}
                          </p>
                          <p className="text-xs text-gray-400 font-medium italic">
                            x {detail.qty}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                          Discount
                        </p>
                        <p className="text-xs text-orange-500 font-bold">
                          {detail.discountItem > 0
                            ? `- Rp ${formatNumberWithDecimals(detail.discountItem)}`
                            : "-"}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator className="bg-gray-50/50" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      {isReturn ? "Return Total" : "Subtotal"}
                    </span>
                    <div className="flex flex-col text-right">
                      <p className="text-sm font-black text-gray-900 tracking-tight">
                        Rp {formatNumberWithDecimals(detail.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
