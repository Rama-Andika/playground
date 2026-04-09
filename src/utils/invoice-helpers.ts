import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";

/**
 * Get derived customer information from sales data.
 * If customer name is "PUBLIC", it will try to fallback to parentName.
 * Same for phone.
 */
export function getDerivedCustomerInfo(sales: SalesTakingPlaygroundView) {
  const customerName =
    sales.customerName !== "PUBLIC"
      ? sales.customerName
      : sales.parentName
        ? sales.parentName
        : sales.customerName;

  const customerPhone =
    sales.customerName !== "PUBLIC"
      ? sales.customerPhone
      : sales.parentName
        ? sales.parentPhone
        : sales.customerPhone;

  return { customerName, customerPhone };
}
