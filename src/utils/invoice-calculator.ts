import type { SalesTakingDetailPlaygroundView } from "@/interfaces/sales-taking-detail.interface";

/**
 * Calculates the total for a single invoice/return item.
 * 
 * @param detail The sales taking detail item
 * @param isReturn Whether the calculation is for a return
 * @returns The calculated total for the item
 */
export function calculateDetailTotal(
  detail: SalesTakingDetailPlaygroundView,
  isReturn: boolean = false
): number {
  if (isReturn) {
    // For returns, we calculate based on qtyReturn and unit price/discount
    const discountItemPerUnit = detail.qty ? detail.discountItem / detail.qty : 0;
    const qtyReturn = detail.qtyReturn || 0;
    const price = detail.price || 0;
    
    const subtotal = (qtyReturn * price) - (discountItemPerUnit * qtyReturn);
    return Math.max(0, subtotal);
  }
  
  // For standard invoices
  const subtotal = (detail.price * detail.qty) - detail.discountItem;
  return Math.max(0, subtotal);
}

/**
 * Calculates the grand total for an entire invoice or return.
 * 
 * @param details Array of sales taking details
 * @param isReturn Whether the calculation is for a return
 * @returns The grand total
 */
export function calculateInvoiceTotal(
  details: SalesTakingDetailPlaygroundView[],
  isReturn: boolean = false
): number {
  return details.reduce((prev, curr) => {
    return prev + calculateDetailTotal(curr, isReturn);
  }, 0);
}
