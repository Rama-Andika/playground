import { Badge } from "@/components/ui/badge";
import {
  PLAYGROUND_STATUS_BADGE,
  type PlaygroundSessionTypeStatus,
} from "@/enums/playground-session-status.enum";
import type { PlaygroundSessionView } from "@/interfaces/playground-session.interface";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const columnsInactive: ColumnDef<PlaygroundSessionView>[] = [
  // ======================
  // NO
  // ======================
  {
    id: "no",
    header: "#",
    size: 48,
    maxSize: 48,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { start: number } | undefined;
      const start = meta?.start ?? 1;

      return <div className="whitespace-nowrap">{row.index + start}</div>;
    },
  },

  // ======================
  // PARENT NAME
  // ======================
  {
    accessorKey: "parentName",
    header: "Parent Name",
    size: 220,
    cell: ({ getValue }) => (
      <div className="font-medium truncate">{getValue<string>()}</div>
    ),
  },

  // ======================
  // PARENT PHONE
  // ======================
  {
    accessorKey: "parentPhone",
    header: "Phone",
    size: 220,
    cell: ({ getValue }) => (
      <div className="font-medium truncate">{getValue<string>()}</div>
    ),
  },

  // ======================
  // PARENT CODE
  // ======================
  {
    accessorKey: "parentCode",
    header: "Parent Code",
    size: 220,
    cell: ({ getValue }) => (
      <div className="font-medium truncate">{getValue<string>()}</div>
    ),
  },

  // ======================
  // CHILD NAME (PRIMARY)
  // ======================
  {
    accessorKey: "childName",
    header: "Child Name",
    size: 220,
    cell: ({ getValue }) => (
      <div className="font-medium truncate">{getValue<string>()}</div>
    ),
  },

  // ======================
  // SESSION CODE (PRIMARY)
  // ======================
  {
    accessorKey: "code",
    header: "Code",
    size: 220,
    cell: ({ getValue }) => (
      <div className="font-medium truncate">{getValue<string>()}</div>
    ),
  },

  // ======================
  // REGISTRATION NUMBER
  // ======================
  {
    accessorKey: "number",
    header: "Reg Number",
    size: 220,
    cell: ({ getValue }) => (
      <div className=" truncate text-muted-foreground">
        {getValue<string>()}
      </div>
    ),
  },

  // ======================
  // END TIME
  // ======================
  {
    accessorKey: "endTime",
    header: "End Time",
    size: 190,
    cell: ({ getValue }) => {
      const endTime = getValue<string>();

      return (
        <div className="font-mono text-sm whitespace-nowrap text-muted-foreground">
          {endTime ? dayjs(endTime).format("DD MMM YYYY HH:mm") : "-"}
        </div>
      );
    },
  },

  // ======================
  // STATUS
  // ======================
  {
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ getValue }) => {
      const status = getValue<PlaygroundSessionTypeStatus>();
      const badge = PLAYGROUND_STATUS_BADGE[status];

      return (
        <div className="flex justify-center">
          <Badge
            className="px-3 py-1 text-xs font-semibold tracking-wide"
            style={{
              backgroundColor: badge.bg,
              color: badge.text,
            }}
          >
            {status.replaceAll("_", " ")}
          </Badge>
        </div>
      );
    },
  },
];
