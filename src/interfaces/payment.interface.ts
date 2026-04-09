export interface PaymentView{
    id: string
    amount: number
    costCardAmount: number
    costCardPercent: number
    bank: string
    merchant: string
    paymentMethod: string
}