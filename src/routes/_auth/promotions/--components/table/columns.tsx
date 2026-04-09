import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DOCUMENT_STATUS_COLOR,
  type DocumentStatusType,
} from "@/enums/document-status.enum";
import { PROMOTION_TYPE } from "@/enums/promotion-type.enum";
import type { PromotionView } from "@/interfaces/promotion.interface";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const columns: ColumnDef<PromotionView>[] = [
  {
    size: 50,
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ getValue }) => {
      const number = getValue<string>();
      return <Button variant="link">{number}</Button>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ getValue }) => {
      const date = getValue<string>();
      return (
        <div className="font-mono text-muted-foreground text-sm">
          {dayjs(date).format("DD-MMM-YYYY, HH:mm:ss")}
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ getValue }) => {
      const date = getValue<string>();
      return (
        <div className="font-mono text-muted-foreground text-sm">
          {dayjs(date).format("DD-MMM-YYYY, HH:mm:ss")}
        </div>
      );
    },
  },
  {
    size: 100,
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => {
      const type = getValue<number>();
      return <div>{PROMOTION_TYPE[type]}</div>;
    },
  },
  {
    size: 200,
    accessorKey: "description",
    header: "Description",
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<DocumentStatusType>();
      const bd = DOCUMENT_STATUS_COLOR[status];
      return (
        <Badge
          style={{
            backgroundColor: bd.bg,
            color: bd.text,
          }}
        >
          {status}
        </Badge>
      );
    },
  },
];
