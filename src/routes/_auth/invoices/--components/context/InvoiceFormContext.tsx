import React, { createContext, useContext, type ReactNode } from "react";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import type { SalesTakingDetailPlaygroundView } from "@/interfaces/sales-taking-detail.interface";
import type { DocumentStatusType } from "@/enums/document-status.enum";
import type { Updater } from "use-immer";
import type { SmallInvoiceRef } from "../print/small-invoice.print";

import type { PaymentSchemaType } from "@/schemas/payment.schema";

export interface InvoiceFormContextType {
  sales: SalesTakingPlaygroundView;
  setSales: Updater<SalesTakingPlaygroundView>;
  salesDetail: SalesTakingDetailPlaygroundView;
  setSalesDetail: Updater<SalesTakingDetailPlaygroundView>;
  total: number;
  customerName: string;
  customerPhone: string;
  isPending: boolean;
  status: DocumentStatusType;
  docStatus: DocumentStatusType;
  userLevelCanCancelSales: string[];
  userLevel: string;
  selectedDetailId: string | null;
  setSelectedDetailId: (id: string | null) => void;
  dialogInvoiceItem: boolean;
  setDialogInvoiceItem: React.Dispatch<React.SetStateAction<boolean>>;
  dialogCustomer: boolean;
  setDialogCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  dialogPayment: boolean;
  setDialogPayment: React.Dispatch<React.SetStateAction<boolean>>;
  dialogItemMasterWithPrice?: boolean;
  setDialogItemMasterWithPrice?: React.Dispatch<React.SetStateAction<boolean>>;
  errors: Record<string, string>;
  detailErrors: Record<string, string>;
  handleSave: () => Promise<void>;
  handlePayment?: (payment: PaymentSchemaType) => Promise<void>;
  deleteDetail?: (id: string) => Promise<void>;
  setStatus: (status: DocumentStatusType) => void;
  inputsRef?: React.RefObject<(HTMLInputElement | null)[]>;
  printRef?: React.RefObject<SmallInvoiceRef | null>;
  setRef: (el: HTMLInputElement | null, index: number) => void;
  handleChange: (key: any, value: any) => void;
  handleBarcodeSearch: () => Promise<void>;
  handleClickSaveItem: () => void;
  handleClickReset?: () => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  // Props for Return mode
  mode?: "invoice" | "return" | "return-edit";
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(
  undefined,
);

export const useInvoiceContext = () => {
  const context = useContext(InvoiceFormContext);
  if (!context) {
    throw new Error(
      "useInvoiceContext must be used within an InvoiceFormProvider",
    );
  }
  return context;
};

interface InvoiceFormProviderProps {
  value: InvoiceFormContextType;
  children: ReactNode;
}

export const InvoiceFormProvider: React.FC<InvoiceFormProviderProps> = ({
  value,
  children,
}) => {
  return (
    <InvoiceFormContext.Provider value={value}>
      {children}
    </InvoiceFormContext.Provider>
  );
};
