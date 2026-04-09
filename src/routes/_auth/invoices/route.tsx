import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/invoices")({
  component: RouteComponent,
  staticData: {
    breadcrumb: "Invoice Records",
  },
});

function RouteComponent() {
  return <Outlet />;
}
