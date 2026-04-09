export const PAYMENT_TYPE = {
  USE_NONE: 0,
  USE_MERCHANT: 1,
  USE_BANK: 2,
} as const;

export type PaymentType = (typeof PAYMENT_TYPE)[keyof typeof PAYMENT_TYPE];

export const PAYMENT_CODE = {
  CASH: 0,
  COMPLIMENT: 1,
  VOUCHER: 2,
  CASH_BACK: 3,
  NON_REFUND: 4,
  GIRO: 5,
} as const;

export type PaymentCodeType = (typeof PAYMENT_CODE)[keyof typeof PAYMENT_CODE];
