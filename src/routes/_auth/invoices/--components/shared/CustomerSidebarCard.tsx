import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuPencil } from "react-icons/lu";
import { FieldError } from "@/components/ui/field";
import { useInvoiceContext } from "../context/InvoiceFormContext";

interface CustomerSidebarCardProps {
  onEditClick?: () => void;
  error?: string;
  isDraft?: boolean;
}

export const CustomerSidebarCard = ({
  onEditClick,
  error,
  isDraft = true,
}: CustomerSidebarCardProps) => {
  const { customerName, customerPhone } = useInvoiceContext();

  return (
    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
      <CardHeader className="bg-gray-50/10 border-b border-gray-50 pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-main rounded-full" />
            Customer
          </div>
          {isDraft && onEditClick && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-gray-200 hover:bg-main/5 hover:text-main transition-all h-9 w-9"
              onClick={onEditClick}
            >
              <LuPencil size={14} />
            </Button>
          )}
        </CardTitle>
        {error && <FieldError>{error}</FieldError>}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
              Full Name
            </p>
            <p className="text-sm font-bold text-gray-700 truncate">
              {customerName}
            </p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
              Phone Number
            </p>
            <p className="text-sm font-bold text-gray-700">
              {customerPhone}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
