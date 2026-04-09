import z from "zod";

export const paymentSchema = z.object({
  payDate: z.string().min(1, { error: "payment date is required" }),
  amount: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return 0;
      const num = Number(val);
      return isNaN(num) ? val : num;
    },
    z.number({ error: "amount must be a number" }).default(0),
  ),
  bankId: z.string().default(""),
  merchantId: z.string().default(""),
  merchantPaymentBy: z.number().default(0),
  merchantPercentExpense: z.number().default(0),
  paymentMethodId: z.string().min(1, { error: "payment method is required" }),
});

export type PaymentSchemaType = z.infer<typeof paymentSchema>;

export const paymentSchmeaInitialValue: PaymentSchemaType = {
  payDate: "",
  amount: 0,
  bankId: "",
  merchantId: "",
  merchantPaymentBy: 0,
  merchantPercentExpense: 0,
  paymentMethodId: "",
};
