import { generateNumericId } from "@/utils/generate-numeric-id";

export interface SalesTakingDetailPlaygroundView {
  id: string;
  salesDetailReturnId: string;
  itemMasterId: string;
  itemMasterName: string;
  itemMasterBarcode: string;
  price: number;
  qty: number;
  qtyReturn: number;
  total: number;
  discountItem: number;
  discountItemPercent: number;
  uomId: string;
  convQty: number;
  prevReturn: number;
}

export const salesTakingDetailPlaygroundViewInitialValue =
  (): SalesTakingDetailPlaygroundView => {
    return {
      id: generateNumericId(),
      salesDetailReturnId: "",
      itemMasterId: "",
      itemMasterName: "",
      itemMasterBarcode: "",
      price: 0,
      qty: 1,
      qtyReturn: 0,
      total: 0,
      discountItem: 0,
      discountItemPercent: 0,
      uomId: "",
      convQty: 1,
      prevReturn: 0,
    };
  };
