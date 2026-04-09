import { Badge } from "@/components/ui/badge";
import {
  DOCUMENT_STATUS_COLOR,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import { Link, type ToPathOption } from "@tanstack/react-router";
import dayjs from "dayjs";
import { formatNumberWithDecimals } from "@/utils/format-number";

interface Props {
  data: SalesTakingPlaygroundView;
}

export function CardInvoice({ data }: Props) {
  const badge = DOCUMENT_STATUS_COLOR[data.docStatus as DocumentStatusType];

  const customer =
    data.customerName !== "PUBLIC"
      ? data.customerName
      : data.parentName
        ? data.parentName
        : data.customerName;

  const to: ToPathOption = data.salesReturnId
    ? `/invoices/return/$id`
    : "/invoices/$id";

  return (
    <Link to={to} params={{ id: data.number }} className="block">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 p-5 mb-4 transition-all hover:shadow-md active:scale-[0.98] flex items-center justify-between group">
        <div className="flex flex-col gap-1 overflow-hidden pr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
              {data.number}
            </span>
            <Badge
              className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border-none"
              style={{
                backgroundColor: `${badge.bg}10`,
                color: badge.text,
              }}
            >
              {data.docStatus}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-700 text-[17px] tracking-tight truncate leading-tight transition-colors group-hover:text-main">
            {customer}
          </h3>

          <p className="text-[11px] font-medium text-gray-400 uppercase mt-0.5">
            {dayjs(data.date).format("DD MMM YYYY")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <p className="text-gray-800 font-semibold text-[18px] tracking-tighter leading-none">
            Rp {formatNumberWithDecimals(data.amount)}
          </p>
          <div className="bg-gray-50/50 p-1.5 rounded-xl group-hover:bg-main/10 transition-colors">
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-main transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
