import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DataTablePagination } from "../data-table-pagination";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import ButtonSearch from "../button/ButtonSearch";
import { ButtonLoading } from "../button/ButtonLoading";
import { Button } from "../ui/button";
import {
  customerSearchInitialValue,
  type CustomerSearch,
  type CustomerView,
} from "@/interfaces/customer.interface";
import { customerQueries } from "@/queries/customer.queries";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelect: (customer: CustomerView) => void;
}

const DialogCustomer = ({ open, setOpen, handleSelect }: Props) => {
  if (!open) return null;

  const columns = useMemo((): ColumnDef<CustomerView>[] => {
    return [
      {
        id: "action",
        header: "#",
        size: 48,
        maxSize: 48,
        cell: (info) => {
          return (
            <Button
              variant="link"
              className="text-blue-400 cursor-pointer"
              onClick={() => {
                handleSelect(info.row.original);
                setOpen(false);
              }}
            >
              select
            </Button>
          );
        },
      },
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
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="text-muted-foreground">{row.getValue("phone")}</div>
        ),
      },
    ];
  }, []);

  const [search, setSearch] = useState<CustomerSearch>(
    customerSearchInitialValue,
  );

  //Query for fetch item masters
  const { data, isFetched } = useQuery(customerQueries.all(search));
  const totalPages = data?.pagination.totalPages ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    setSearch((prev) => ({
      ...prev,
      name,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="block">
        <DialogHeader>
          <DialogTitle>Customers</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-1" onSubmit={handleSearch}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input name="name" />
          </div>
          <div className="flex flex-col gap-2 items-end justify-end">
            {!isFetched ? (
              <ButtonLoading />
            ) : (
              <ButtonSearch variant="outline" />
            )}
          </div>
        </form>
        <div className="max-h-[50vh] overflow-y-auto">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            tableOptions={{
              meta: {
                start: data?.pagination.start ?? 1,
              },
              manualPagination: true,
            }}
          />
        </div>
        <DialogFooter>
          <DataTablePagination
            page={search.page ?? 0}
            size={search.size ?? 25}
            totalPages={totalPages}
            showPageSize={false}
            onPageChange={(nextPage) =>
              setSearch((prev) => ({
                ...prev,
                page: Math.max(0, nextPage),
              }))
            }
            onSizeChange={(nextSize) =>
              setSearch((prev) => ({
                ...prev,
                size: nextSize,
                page: 0,
              }))
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCustomer;
