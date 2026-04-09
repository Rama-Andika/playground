import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { playgroundSessionReportQueries } from "@/queries/playground-session-report.queries";
import SessionReportDesktopView from "./--components/SessionReportDesktopView";
import SessionReportMobileView from "./--components/SessionReportMobileView";

const searchSchema = z.object({
  registrationNumber: z.string().catch(""),
  page: z.number().catch(0),
  size: z.number().catch(50),
});

export const Route = createFileRoute("/_auth/reports/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  staticData: { breadcrumb: "Reports" },
});

function RouteComponent() {
  const { registrationNumber, page, size } = Route.useSearch();
  const navigate = Route.useNavigate();

  //   =====QUERY=====
  //   ===============
  const { data } = useQuery(
    playgroundSessionReportQueries.sessionReport({
      registrationNumber,
      page,
      size,
    }),
  );

  const totalPages = data?.pagination.totalPages ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const registrationNumber = formData.get("number") as string;
    navigate({ search: (prev) => ({ ...prev, registrationNumber, page: 0 }) });
  };

  const sharedProps = {
    data: data?.data ?? [],
    pagination: {
      page: page ?? 0,
      size: size ?? 50,
      totalPages,
      start: data?.pagination.start ?? 1,
    },
    registrationNumber,
    handleSearch,
    onPageChange: (nextPage: number) =>
      navigate({ search: (prev) => ({ ...prev, page: Math.max(0, nextPage) }) }),
    onSizeChange: (nextSize: number) =>
      navigate({ search: (prev) => ({ ...prev, size: nextSize, page: 0 }) }),
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      {/* Viewport: Desktop (>= md) */}
      <div className="hidden md:block">
        <SessionReportDesktopView {...sharedProps} />
      </div>

      {/* Viewport: Mobile (< md) */}
      <div className="md:hidden h-full">
        <SessionReportMobileView {...sharedProps} />
      </div>
    </div>
  );
}
