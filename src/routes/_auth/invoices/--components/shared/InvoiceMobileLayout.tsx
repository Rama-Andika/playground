import type { ReactNode } from "react";

interface InvoiceMobileLayoutProps {
  header: ReactNode;
  infoCard: ReactNode;
  content: ReactNode;
  customerSection: ReactNode;
  bottomBar: ReactNode;
}

export const InvoiceMobileLayout = ({
  header,
  infoCard,
  content,
  customerSection,
  bottomBar,
}: InvoiceMobileLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {header}

      {infoCard}

      <div className="flex flex-col gap-8 px-4">
        {content}

        {customerSection}
      </div>

      {bottomBar}
    </div>
  );
};

export default InvoiceMobileLayout;
