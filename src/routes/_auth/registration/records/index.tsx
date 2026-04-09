import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import { playgroundRegistrationQueries } from "@/queries/playground-registration.queries";
import { PageHeader } from "@/components/page-header";
import RegistrationRecordsDesktop from "./--components/RegistrationRecordsDesktop";
import RegistrationRecordsMobile from "./--components/RegistrationRecordsMobile";

const RegistrationRecordsSchema = z.object({
  page: z.number().catch(0),
  size: z.number().catch(25),
});

export const Route = createFileRoute("/_auth/registration/records/")({
  validateSearch: RegistrationRecordsSchema,
  component: RouteComponent,
  staticData: { breadcrumb: "Registration Records" },
});

function RouteComponent() {
  const route = Route;
  const { page, size } = route.useSearch();
  const navigate = route.useNavigate();

  //Query to fetch data
  const { data, isLoading } = useQuery(
    playgroundRegistrationQueries.playgroundRegistrations({
      page: page ?? 0,
      size: size ?? 25,
    }),
  );

  const totalPages = data?.pagination.totalPages ?? 0;
  const start = data?.pagination.start ?? 1;

  const onPageChange = (nextPage: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.max(0, nextPage),
      }),
    });
  };

  const onSizeChange = (nextSize: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        size: nextSize,
        page: 0,
      }),
    });
  };

  const sharedProps = {
    data: data?.data ?? [],
    isLoading,
    page,
    size,
    totalPages,
    start,
    onPageChange,
    onSizeChange,
  };

  const PAGE_TITLE = "Registration Records";
  const PAGE_SUBTITLE = "List of registration records";

  return (
    <div className="w-full h-full">
      {/* Tampilan Desktop */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
          <PageHeader title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
          <RegistrationRecordsDesktop {...sharedProps} title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
        </div>
      </div>

      {/* Tampilan Mobile */}
      <div className="md:hidden h-full">
        <RegistrationRecordsMobile {...sharedProps} title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />
      </div>
    </div>
  );
}
