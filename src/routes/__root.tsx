import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { type Auth } from "@/contexts/auth.context";

type MyContext = {
  auth: Auth;
};

export const Route = createRootRouteWithContext<MyContext>()({
  component: () => {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Outlet />
        {/* <AutoLogout /> */}
        <TanStackRouterDevtools position="top-right" />
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="top-right"
        />
      </>
    );
  },
});
