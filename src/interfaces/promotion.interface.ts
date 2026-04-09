export interface PromotionView {
  id: string;
  number: string;
  startDate: string;
  endDate: string;
  type: number;
  description: string;
  status: string;
}

export interface PromotionSearch {
  number: string;
  startDate: string;
  endDate: string;
  type: number;
  subType: number;
  description: string;
  page: number;
  size: number;
}

export const promotionSearchInitialValue: PromotionSearch = {
  number: "",
  startDate: "",
  endDate: "",
  type: 0,
  subType: 0,
  description: "",
  page: 0,
  size: 10,
};
