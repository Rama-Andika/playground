import ButtonSearch from "@/components/button/ButtonSearch";
import { Heading } from "@/components/heading";
import { SubHeading } from "@/components/sub-heading";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { DrawerFilter } from "./--components/drawer-filter";
import { PromotionTable } from "./--components/table/promotion-table";


export const Route = createFileRoute("/_auth/promotions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>
        <Heading>Promotions</Heading>
        <SubHeading>List of promotions</SubHeading>
      </div>
      <form>
        <Field orientation="horizontal" className="flex justify-end ">
          <Input
            className="w-64"
            name="number"
            placeholder="promotion number..."
          />
          <ButtonSearch />
          <DrawerFilter />
        </Field>
      </form>
      <PromotionTable />
    </>
  );
}
