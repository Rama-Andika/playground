import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { DOCUMENT_STATUS_COLOR, type DocumentStatusType } from "@/enums/document-status.enum";
import dayjs from "dayjs";

interface InvoiceDesktopHeaderProps {
  title: string;
  status: DocumentStatusType;
  date?: Date | string;
  refNumber?: string;
  children?: React.ReactNode;
}

export const InvoiceDesktopHeader = ({
  title,
  status,
  date = new Date(),
  refNumber,
  children,
}: InvoiceDesktopHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <PageHeader
            title={title}
            subtitle=""
            className="mb-0! pb-0! border-b-0!"
          />
          <Badge
            className="px-3 py-1 text-sm font-semibold rounded-lg"
            style={{
              backgroundColor: DOCUMENT_STATUS_COLOR[status].bg,
              color: DOCUMENT_STATUS_COLOR[status].text,
            }}
          >
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {refNumber && (
            <>
              <p className="text-[11px] font-bold text-main uppercase tracking-widest bg-main/5 px-2 py-0.5 rounded-md">
                REF: {refNumber}
              </p>
              <span className="text-gray-300">|</span>
            </>
          )}
          <p className="text-sm text-gray-400 font-mono">
            {date ? dayjs(date).format("ddd, DD MMM YYYY") : "-"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};
