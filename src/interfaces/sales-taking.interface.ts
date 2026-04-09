import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import { type SalesTakingDetailPlaygroundView } from "./sales-taking-detail.interface";
import type { PaymentView } from "./payment.interface";
import type { ReturnPaymentView } from "./return-payment.interface";

export interface SalesTakingPlaygroundView {
  id: string;
  salesReturnId: string;
  number: string;
  date: string;
  parentName: string;
  parentPhone: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  docStatus: string;
  amount: number;
  globalDiscount: number;
  payment: PaymentView;
  returnPayment: ReturnPaymentView;
  salesTakingDetails: SalesTakingDetailPlaygroundView[];
}

export const salesTakingPlaygroundViewInitialValue: SalesTakingPlaygroundView =
  {
    id: "",
    salesReturnId: "",
    number: "",
    date: "",
    parentName: "",
    parentPhone: "",
    customerId: "",
    customerName: "",
    customerPhone: "",
    docStatus: DOCUMENT_STATUS.DRAFT,
    amount: 0,
    globalDiscount: 0,
    payment: {
      id: "",
      amount: 0,
      costCardAmount: 0,
      costCardPercent: 0,
      bank: "",
      merchant: "",
      paymentMethod: "",
    },
    returnPayment: {
      id: "",
      amount: 0,
    },
    salesTakingDetails: [],
  };

export interface SalesTakingSearch {
  number: string;
  status: string;
  page: number;
  size: number;
}
