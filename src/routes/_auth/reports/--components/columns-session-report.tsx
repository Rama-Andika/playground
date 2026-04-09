import type { PlaygroundSessionReportView } from "@/interfaces/playground-session-report.interface";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const columns: ColumnDef<PlaygroundSessionReportView>[] = [
  {
    id: "no",
    header: "#",
    size: 40,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { start: number } | undefined;
      const start = meta?.start ?? 1;

      return <div className="whitespace-nowrap">{row.index + start}</div>;
    },
  },
  {
    accessorKey: "registrationNumber",
    header: "Registration Number",
  },
  {
    accessorKey: "parentName",
    header: "Parent Name",
  },
  {
    accessorKey: "parentPhone",
    header: "Parent Phone",
  },
  {
    accessorKey: "childName",
    header: "Child Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ getValue }) => {
      const duration = getValue<number>();
      return (
        <div className="font-mono text-sm whitespace-nowrap text-muted-foreground">
          {duration} min
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ getValue }) => {
      const endTime = getValue<string>();

      return (
        <div className="font-mono text-sm whitespace-nowrap text-muted-foreground">
          {endTime ? dayjs(endTime).format("DD MMM YYYY HH:mm") : "-"}
        </div>
      );
    },
  },
];
