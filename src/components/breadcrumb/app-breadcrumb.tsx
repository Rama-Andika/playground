// components/breadcrumb/AppBreadcrumb.tsx
import { useMatches, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { resolveBreadcrumb } from "./utils";

const AppBreadcrumb = () => {
  const matches = useMatches();

  // Ambil hanya route yang punya breadcrumb
  const crumbs = matches
    .map((match: any) => {
      const label = resolveBreadcrumb(match.staticData?.breadcrumb, match);

      if (!label) return null;

      return {
        label,
        to: match.pathname,
      };
    })
    .filter(Boolean) as { label: string; to: string }[];

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <div key={crumb.to} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
