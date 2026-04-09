import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field";
import ButtonSearch from "@/components/button/ButtonSearch";
import ButtonIconSave from "@/components/button/icon/ButtonIconSave";
import ButtonIconPencil from "@/components/button/icon/ButtonIconPencil";
import ButtonIconTrash from "@/components/button/icon/ButtonIconTrash";
import ButtonIconX from "@/components/button/icon/ButtonIconX";
import { formatNumberWithDecimals } from "@/utils/format-number";
import { toValidNumber } from "@/utils/to-valid-number";
import { AlertDialogConfirmationDelete } from "@/components/alert-dialog/alert-dialog-confirmation-delete";
import {
  salesTakingDetailPlaygroundViewInitialValue,
  type SalesTakingDetailPlaygroundView,
} from "@/interfaces/sales-taking-detail.interface";
import { useInvoiceContext } from "../context/InvoiceFormContext";


interface DesktopInvoiceItemTableProps {
  isDraft: boolean;
  emptyMessage?: string;
  handleEditItem?: (detail: SalesTakingDetailPlaygroundView) => void;
  mode?: "invoice" | "return" | "return-edit";
}

export const DesktopInvoiceItemTable = ({
  isDraft,
  emptyMessage = "No items found.",
  handleEditItem,
  mode = "invoice",
}: DesktopInvoiceItemTableProps) => {
  const isReturn = mode === "return" || mode === "return-edit";
  const columnsCount = isReturn ? 9 : 7;
  const { inputsRef } = useInvoiceContext();

  const {
    sales,
    salesDetail,
    selectedDetailId,
    detailErrors,
    setDialogItemMasterWithPrice,
    setSelectedDetailId,
    setSalesDetail,
    handleKeyDown,
    handleChange,
    handleClickSaveItem,
    deleteDetail,
    setRef,
  } = useInvoiceContext();

  return (
    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
      <CardHeader className="bg-gray-50/10 border-b border-gray-50 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-main rounded-full" />
          {isReturn ? "Items to Return" : "Purchased Items"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto text-sm">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-gray-50/5">
            <TableRow className="hover:bg-transparent border-gray-50 uppercase text-[10px] tracking-widest font-bold text-gray-500">
              <TableHead className="w-32 pl-6">Barcode</TableHead>
              <TableHead className="min-w-48">Item</TableHead>
              <TableHead className="text-right w-28">Price</TableHead>
              <TableHead className="text-right w-20">Qty</TableHead>
              <TableHead className="text-right w-40">Disc</TableHead>
              {isReturn && mode === "return" && (
                <>
                  <TableHead className="text-right w-24">Prev Ret</TableHead>
                  <TableHead className="text-right w-24 text-main font-bold">
                    Qty Ret
                  </TableHead>
                </>
              )}
              <TableHead className="text-right w-40">Subtotal</TableHead>
              <TableHead className="w-20 text-center pr-6">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Item Input Row (DRAFT Only, Invoice Only) */}
            {isDraft && !selectedDetailId && !isReturn && (
              <TableRow className="border-gray-50 bg-main/5 hover:bg-main/5">
                <TableCell className="pl-6">
                  <Input
                    name="barcode"
                    autoFocus
                    ref={(e) => setRef(e, 0)}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    value={salesDetail.itemMasterBarcode}
                    className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl px-2"
                    onChange={(e) =>
                      handleChange("itemMasterBarcode", e.target.value)
                    }
                  />
                  <FieldError className="mt-1">
                    {detailErrors?.itemMasterId}
                  </FieldError>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Input
                      name="item"
                      ref={(e) => setRef(e, 1)}
                      onKeyDown={(e) => handleKeyDown(e, 1)}
                      placeholder="Browse..."
                      disabled={!!salesDetail.itemMasterName}
                      value={salesDetail.itemMasterName}
                      className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl px-2"
                      onChange={(e) =>
                        handleChange("itemMasterName", e.target.value)
                      }
                    />
                    <ButtonSearch
                      onClick={() => setDialogItemMasterWithPrice?.(true)}
                      label=""
                      className="w-fit!"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    name="price"
                    ref={(e) => setRef(e, 2)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    value={formatNumberWithDecimals(salesDetail.price)}
                    className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right px-2"
                    onChange={(e) =>
                      handleChange("price", toValidNumber(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="qty"
                    ref={(e) => setRef(e, 3)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    value={salesDetail.qty}
                    className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right px-2"
                    onChange={(e) =>
                      handleChange("qty", toValidNumber(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Input
                      name="disc_percent"
                      placeholder="%"
                      className="w-14 h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right px-1"
                      ref={(e) => setRef(e, 4)}
                      onKeyDown={(e) => handleKeyDown(e, 4)}
                      value={salesDetail.discountItemPercent || ""}
                      onChange={(e) =>
                        handleChange(
                          "discountItemPercent",
                          toValidNumber(e.target.value),
                        )
                      }
                    />
                    <Input
                      name="disc_value"
                      placeholder="Val"
                      className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right flex-1 px-2 min-w-0"
                      ref={(e) => setRef(e, 5)}
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                      value={
                        formatNumberWithDecimals(salesDetail.discountItem) ===
                        "0"
                          ? ""
                          : formatNumberWithDecimals(salesDetail.discountItem)
                      }
                      onChange={(e) =>
                        handleChange(
                          "discountItem",
                          toValidNumber(e.target.value),
                        )
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-main">
                  {formatNumberWithDecimals(salesDetail.total)}
                </TableCell>
                <TableCell className="pr-6 text-center">
                  <ButtonIconSave
                    onClick={handleClickSaveItem}
                    className="hover:scale-110 transition-transform"
                  />
                </TableCell>
              </TableRow>
            )}

            {/* List of Added Items */}
            {sales?.salesTakingDetails?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnsCount}
                  className="h-32 text-center text-gray-400 font-medium italic bg-gray-50/5"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sales?.salesTakingDetails?.map((detail) =>
                selectedDetailId !== detail.id ? (
                  <TableRow
                    key={detail.id}
                    className="border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <TableCell className="pl-6 font-mono text-gray-400 text-xs">
                      {detail.itemMasterBarcode}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700">
                      {detail.itemMasterName}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {formatNumberWithDecimals(detail.price)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-700">
                      {detail.qty}
                    </TableCell>
                    <TableCell className="text-right text-orange-500 font-medium">
                      {detail.discountItem > 0
                        ? `-${formatNumberWithDecimals(detail.discountItem)}`
                        : "-"}
                    </TableCell>
                    {isReturn && (
                      <>
                        <TableCell className="text-right text-gray-400">
                          {detail.prevReturn || 0}
                        </TableCell>
                        <TableCell className="text-right font-bold text-main">
                          {detail.qtyReturn || 0}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-right font-bold text-gray-800">
                      {formatNumberWithDecimals(detail.total)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {isDraft && (
                          <div className="flex items-center gap-1">
                            <ButtonIconPencil
                              onClick={() => {
                                if (handleEditItem) {
                                  handleEditItem(detail);
                                } else {
                                  setSalesDetail(detail);
                                  setSelectedDetailId(detail.id);
                                  setTimeout(() => {
                                    inputsRef?.current[3]?.focus();
                                  }, 100);
                                }
                              }}
                            />
                            {!isReturn &&
                              sales.salesTakingDetails.length > 1 && (
                                <AlertDialogConfirmationDelete
                                  onClickDelete={() =>
                                    deleteDetail?.(detail.id)
                                  }
                                >
                                  <ButtonIconTrash />
                                </AlertDialogConfirmationDelete>
                              )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  /* Inline Edit Row (Invoice Only, Return uses Dialog) */
                  <TableRow
                    key={detail.id}
                    className="border-gray-50 bg-amber-50/30"
                  >
                    <TableCell className="pl-6">
                      <Input
                        name="barcode"
                        disabled
                        value={salesDetail.itemMasterBarcode}
                        className="h-10 border-gray-200 focus-visible:ring-main bg-gray-50 rounded-xl px-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="item"
                        disabled
                        value={salesDetail.itemMasterName}
                        className="h-10 border-gray-200 focus-visible:ring-main bg-gray-50 rounded-xl px-2"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="price"
                        ref={(e) => setRef(e, 2)}
                        onKeyDown={(e) => handleKeyDown(e, 2)}
                        value={formatNumberWithDecimals(salesDetail.price)}
                        className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right px-2"
                        onChange={(e) =>
                          handleChange("price", toValidNumber(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="qty"
                        ref={(e) => setRef(e, 3)}
                        onKeyDown={(e) => handleKeyDown(e, 3)}
                        value={salesDetail.qty}
                        className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right px-2"
                        onChange={(e) =>
                          handleChange("qty", toValidNumber(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          name="disc_percent"
                          placeholder="%"
                          className="w-14 h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right px-1"
                          ref={(e) => setRef(e, 4)}
                          onKeyDown={(e) => handleKeyDown(e, 4)}
                          value={salesDetail.discountItemPercent || ""}
                          onChange={(e) =>
                            handleChange(
                              "discountItemPercent",
                              toValidNumber(e.target.value),
                            )
                          }
                        />
                        <Input
                          name="disc_value"
                          placeholder="Val"
                          className="h-10 border-gray-200 focus-visible:ring-main bg-white rounded-xl text-right flex-1 px-2 min-w-0"
                          ref={(e) => setRef(e, 5)}
                          onKeyDown={(e) => handleKeyDown(e, 5)}
                          value={
                            formatNumberWithDecimals(
                              salesDetail.discountItem,
                            ) === "0"
                              ? ""
                              : formatNumberWithDecimals(
                                  salesDetail.discountItem,
                                )
                          }
                          onChange={(e) =>
                            handleChange(
                              "discountItem",
                              toValidNumber(e.target.value),
                            )
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-main">
                      {formatNumberWithDecimals(salesDetail.total)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-center gap-1">
                        <ButtonIconSave onClick={handleClickSaveItem} />
                        <ButtonIconX
                          onClick={() => {
                            setSelectedDetailId(null);
                            setSalesDetail(
                              salesTakingDetailPlaygroundViewInitialValue(),
                            );
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
