import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.authenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "",
        },
      });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
