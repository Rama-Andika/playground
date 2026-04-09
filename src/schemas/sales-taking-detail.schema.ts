import type { SalesTakingDetailPlaygroundView } from "@/interfaces/sales-taking-detail.interface";
import { generateNumericId } from "@/utils/generate-numeric-id";
import z from "zod";

export const salesTakingDetailSchema = z
  .object({
    id: z.string().default(""),
    itemMasterId: z.string().min(1, { error: "Item is required" }),
    price: z.number().default(0),
    qty: z.number().default(0),
    qtyReturn: z.number().default(0),
    discountItem: z.number().default(0),
    uomId: z.string().default(""),
    convQty: z.number().default(1),
  })
  .refine((data) => data.price * data.qty - data.discountItem >= 0, {
    message: "Total cannot be negative",
    path: ["discountItem"],
  });

export type SalesTakingDetailSchemaType = z.infer<
  typeof salesTakingDetailSchema
>;

export const salesTakingDetailSchemaInitialValue =
  (): SalesTakingDetailSchemaType => {
    return {
      id: generateNumericId(),
      itemMasterId: "",
      price: 0,
      qty: 0,
      qtyReturn: 0,
      discountItem: 0,
      uomId: "",
      convQty: 1,
    };
  };

export const salesTakingDetailSchemaMap = (
  salesTakingDetail: SalesTakingDetailPlaygroundView,
): SalesTakingDetailSchemaType => {
  return {
    id: salesTakingDetail.id,
    itemMasterId: salesTakingDetail.itemMasterId,
    price: salesTakingDetail.price,
    qty: salesTakingDetail.qty,
    qtyReturn: salesTakingDetail.qtyReturn,
    discountItem: salesTakingDetail.discountItem,
    uomId: salesTakingDetail.uomId,
    convQty: salesTakingDetail.convQty,
  };
};
