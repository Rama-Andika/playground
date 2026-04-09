export type BreadcrumbContext = {
  params: unknown;
  search: any;
  loaderData?: unknown;
};

export type BreadcrumbMeta = string | ((context: BreadcrumbContext) => string);
