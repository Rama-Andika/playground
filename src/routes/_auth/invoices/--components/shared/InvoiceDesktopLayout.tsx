import type { ReactNode } from "react";

interface InvoiceDesktopLayoutProps {
  header: ReactNode;
  content: ReactNode;
  sidebar: ReactNode;
}

export const InvoiceDesktopLayout = ({
  header,
  content,
  sidebar,
}: InvoiceDesktopLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:p-10 max-w-[1536px] mx-auto animate-in fade-in duration-700">
      {header}

      <div className="flex flex-col 2xl:flex-row gap-6 lg:gap-8">
        <div className="flex-1 space-y-6 min-w-0">{content}</div>

        <div className="w-full 2xl:w-[380px] flex flex-col gap-6 shrink-0">
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDesktopLayout;
