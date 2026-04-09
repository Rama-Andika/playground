import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";

import InvoiceDesktopView from "./--components/InvoiceDesktopView";
import InvoiceMobileView from "./--components/InvoiceMobileView";

const RegistrationRecordsSchema = z.object({
  number: z.string().catch(""),
  status: z.string().catch(""),
  page: z.number().catch(0),
  size: z.number().catch(25),
});

export const Route = createFileRoute("/_auth/invoices/")({
  validateSearch: RegistrationRecordsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { number, status } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const PAGE_TITLE = "Invoice Records";
  const PAGE_SUBTITLE = "List of all playground invoice sessions";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const number = formData.get("number") as string;
    let status = formData.get("status") as string;
    status = status === "all" ? "" : status;
    navigate({
      search: (prev) => ({ ...prev, number, status: status, page: 0 }),
    });
  };

  const sharedProps = {
    title: PAGE_TITLE,
    subtitle: PAGE_SUBTITLE,
    number,
    status,
    handleSearch,
  };

  return (
    <div className="w-full h-full bg-gray-50/30">
      {/* Viewport: Desktop (>= md) */}
      <div className="hidden md:block">
        <InvoiceDesktopView {...sharedProps} />
      </div>

      {/* Viewport: Mobile (< md) */}
      <div className="md:hidden h-full">
        <InvoiceMobileView {...sharedProps} />
      </div>
    </div>
  );
}
