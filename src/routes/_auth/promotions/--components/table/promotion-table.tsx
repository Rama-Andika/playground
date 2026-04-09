import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { DataTablePagination } from "@/components/data-table-pagination";
import { useQuery } from "@tanstack/react-query";
import { promotionQueries } from "@/queries/promotion.queries";
import { promotionSearchInitialValue } from "@/interfaces/promotion.interface";

export function PromotionTable() {
  /*===============
  =====QUERY=====
  ===============
  */
  const { data } = useQuery(
    promotionQueries.promotion(promotionSearchInitialValue),
  );

  return (
    <>
      <DataTable columns={columns} data={data?.data || []} />

      <DataTablePagination
        page={0}
        size={0}
        totalPages={0}
        onPageChange={() => {}}
        onSizeChange={() => {}}
      />
    </>
  );
}
