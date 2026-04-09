import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DOCUMENT_STATUS_COLOR,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import { Link, type ToPathOption } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

const columns: ColumnDef<SalesTakingPlaygroundView>[] = [
  {
    id: "no",
    header: "#",
    size: 50,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { start: number } | undefined;
      const start = meta?.start ?? 1;

      return <div className="whitespace-nowrap">{row.index + start}</div>;
    },
  },
  {
    accessorKey: "number",
    header: "Invoice Number",
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer =
        row.original?.customerName !== "PUBLIC"
          ? row.original?.customerName
          : row.original.parentName
            ? row.original.parentName
            : row.original.customerName;
      return <div>{customer}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 140,
    cell: ({ getValue }) => {
      const date = getValue<string>()
        ? dayjs(getValue<string>()).format("DD MMMM YYYY")
        : "";
      return (
        <div className="font-mono text-sm whitespace-nowrap text-muted-foreground">
          {date}
        </div>
      );
    },
  },
  {
    accessorKey: "docStatus",
    header: () => <div className="text-center">Status</div>,
    size: 140,
    cell: ({ getValue }) => {
      const status = getValue<DocumentStatusType>();
      const badge = DOCUMENT_STATUS_COLOR[status];

      return (
        <div className="flex justify-center">
          <Badge
            className="px-3 py-1 text-xs font-semibold tracking-wide"
            style={{
              backgroundColor: badge.bg,
              color: badge.text,
            }}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "detail",
    header: "#",
    cell: ({ row }) => {
      const number = row.original.number;
      const salesReturnId = row.original.salesReturnId;

      const to: ToPathOption = salesReturnId
        ? `/invoices/return/$id`
        : "/invoices/$id";

      return (
        <Link to={to} params={{ id: number }}>
          <Button variant="outline" size="sm">
            Detail
          </Button>
        </Link>
      );
    },
  },
];

export default columns;
