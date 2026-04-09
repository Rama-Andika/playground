import React from "react";
import { App as KonstaApp } from "konsta/react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserHistory,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import "./index.css";
import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/queryClient";
import AuthProvider, { useAuth } from "./contexts/auth.context";
import { useVersion } from "./hooks/useVersion";
import NotFound from "./components/not-found";
import "react-datepicker/dist/react-datepicker.css";
const basename = import.meta.env.VITE_BASENAME;

import { registerSW } from "virtual:pwa-register";
import { Capacitor } from "@capacitor/core";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
});

const selectedHistory = Capacitor.isNativePlatform()
  ? createHashHistory()
  : createBrowserHistory();
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  basepath: basename,
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  history: selectedHistory,
  defaultNotFoundComponent: () => <NotFound />,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  useVersion();
  return (
    <KonstaApp safeAreas theme="ios">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </QueryClientProvider>
    </KonstaApp>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
