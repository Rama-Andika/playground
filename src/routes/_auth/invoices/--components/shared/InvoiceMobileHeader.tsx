import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  DOCUMENT_STATUS_COLOR,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { cn } from "@/lib/utils";

interface InvoiceMobileHeaderProps {
  title: string;
  status: DocumentStatusType;
  onBack?: () => void;
  children?: React.ReactNode; // Right side actions
}

export const InvoiceMobileHeader = ({
  title,
  status,
  onBack,
  children,
}: InvoiceMobileHeaderProps) => {
  return (
    <div
      className={cn(
        "sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shadow-sm rounded-md",
        !onBack && "ps-4",
      )}
    >
      <div className="flex items-center gap-2">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl text-gray-400 hover:text-gray-600 transition-all"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            {title}
          </h1>
          <Badge
            className="w-fit scale-75 -ml-2"
            style={{
              backgroundColor: DOCUMENT_STATUS_COLOR[status].bg,
              color: DOCUMENT_STATUS_COLOR[status].text,
            }}
          >
            {status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
