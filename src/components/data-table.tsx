import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableProps } from "@/interfaces/data-table.interface";

export function DataTable<TData, TValue>({
  columns,
  data,
  tableOptions,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,

    // ===== default behavior =====
    getCoreRowModel: getCoreRowModel(),

    // ===== allow override =====
    ...tableOptions,
  });

  return (
    <div >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination (optional, auto hide if disabled) */}
      {/* {(table.getCanNextPage() || table.getCanPreviousPage()) && (
        <DataTablePagination table={table} />
      )} */}
    </div>
  );
}
