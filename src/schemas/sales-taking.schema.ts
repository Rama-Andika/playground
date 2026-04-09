import z from "zod";
import { salesTakingDetailSchema } from "./sales-taking-detail.schema";
import { type PaymentSchemaType } from "./payment.schema";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import type { User } from "@/contexts/auth.context";

export const salesTakingSchema = z.object({
  id: z.string().default(""),
  date: z.string().default(""),
  customerId: z.string().default(""),
  userId: z.string().min(1, { error: "User is required" }),
  docStatus: z.string().min(1, { error: "Status is required" }),
  amount: z.number().default(0),
  globalDiskon: z.number().default(0),
  locationId: z.string().default(""),
  salesTakingDetails: z
    .array(salesTakingDetailSchema)
    .min(1, { error: "At least one item is required" }),
  payment: z.unknown().optional(),
});

export type SalesTakingSchemaType = z.infer<typeof salesTakingSchema>;

export const salesTakingSchemaMapByPlayground = (
  salesTaking: SalesTakingPlaygroundView | undefined,
  user: User | null,
  payment: PaymentSchemaType | null,
): SalesTakingSchemaType => {
  const body: SalesTakingSchemaType = {
    id: salesTaking?.id ?? "",
    date: salesTaking?.date ?? "",
    customerId: salesTaking?.customerId ?? "",
    userId: user?.userId ?? "",
    docStatus: salesTaking?.docStatus ?? "",
    amount: salesTaking?.amount ?? 0,
    globalDiskon: salesTaking?.globalDiscount ?? 0,
    locationId: "",
    salesTakingDetails:
      salesTaking?.salesTakingDetails.map((detail) => ({
        id: detail.id,
        itemMasterId: detail.itemMasterId,
        price: detail.price,
        qty: detail.qty,
        discountItem: detail.discountItem,
        uomId: detail.uomId,
        convQty: detail.convQty,
        qtyReturn: detail.qtyReturn,
      })) ?? [],
    payment: {
      payDate: salesTaking?.date ?? "",
      amount: payment?.amount ?? 0,
      bankId: payment?.bankId ?? "",
      merchantId: payment?.merchantId ?? "",
      paymentMethodId: payment?.paymentMethodId ?? "",
    },
  };

  return body;
};
