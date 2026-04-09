import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatNumberWithDecimals } from "@/utils/format-number";
import ButtonSave from "@/components/button/ButtonSave";
import { useInvoiceContext } from "../context/InvoiceFormContext";

interface PricingSummaryCardProps {
  isDraft?: boolean;
  children?: React.ReactNode; // For Status Control or other extra fields
}

export const PricingSummaryCard = ({
  isDraft = true,
  children,
}: PricingSummaryCardProps) => {
  const { total, isPending, handleSave } = useInvoiceContext();

  return (
    <Card className="rounded-3xl border-main/10 bg-main/2 shadow-sm shadow-main/5 overflow-hidden">
      <CardHeader className="bg-main/5 border-b border-main/10 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-main">
          <span className="w-1.5 h-6 bg-main rounded-full" />
          Pricing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between text-gray-500">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="text-sm font-bold uppercase tracking-tight">
            Rp {formatNumberWithDecimals(total ?? 0)}
          </span>
        </div>
        <Separator className="bg-main/10" />
        <div className="flex items-center justify-between">
          <span className="text-md font-bold text-gray-700 uppercase">
            Grand Total
          </span>
          <span className="text-2xl font-bold text-main tracking-tighter">
            Rp {formatNumberWithDecimals(total ?? 0)}
          </span>
        </div>
        {children}
      </CardContent>
      {isDraft && (
        <CardFooter className="bg-white p-6 border-t border-main/5">
          <div className="flex justify-end w-full">
            <ButtonSave
              disabled={isPending}
              loading={isPending}
              onClick={handleSave}
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
