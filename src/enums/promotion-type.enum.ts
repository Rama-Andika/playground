export const PROMOTION_TYPE: Record<number, string> = {
  0: "Discount",
  1: "Bundling",
  5: "Category",
  6: "Claim",
  7: "Tebus Murah",
};

export type PromotionType =
  (typeof PROMOTION_TYPE)[keyof typeof PROMOTION_TYPE];
