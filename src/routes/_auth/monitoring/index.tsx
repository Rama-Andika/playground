import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import dayjs from "dayjs";
import MonitoringDesktop from "./--components/MonitoringDesktop";
import MonitoringMobile from "./--components/MonitoringMobile";


const monitoringSchema = z.object({
  tab: z.enum(["active", "inactive"]).default("active"),
  date: z.string().catch(dayjs(new Date()).format("YYYY-MM-DD")),
  page: z.number().catch(0),
  size: z.number().catch(50),
});

export const Route = createFileRoute("/_auth/monitoring/")({
  validateSearch: monitoringSchema,
  component: RouteComponent,
  staticData: { breadcrumb: "Monitoring" },
});

function RouteComponent() {
  const PAGE_TITLE = "Monitoring ";
  const PAGE_SUBTITLE = "Session Monitoring Dashboard";

  return (
    <div className="w-full h-full">
      {/* Tampilan Desktop (md ke atas) */}
      <div className="hidden md:block">
        <MonitoringDesktop title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
      </div>

      {/* Tampilan Mobile (ke bawah dari md) */}
      <div className="md:hidden h-full">
        <MonitoringMobile title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
      </div>
    </div>
  );
}
