import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/promotions")({
  component: RouteComponent,
  staticData: {
    breadcrumb: "Promotions",
  },
});

function RouteComponent() {
  return <Outlet />;
}
