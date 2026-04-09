import type { PlaygroundRegistrationView } from "@/interfaces/playground-registration.interface";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import QrCode from "../qr-code";

const columns: ColumnDef<PlaygroundRegistrationView>[] = [
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
    accessorKey: "regNumber",
    header: "Registration Number",
  },
  {
    accessorKey: "parentName",
    header: "Parent Name",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
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
    id: "qrCode",
    header: "#",
    cell: ({ row }) => {
      return <QrCode value={row.original.regNumber} />;
    },
  },
];

export default columns;
