import type { ReactNode } from "react";

interface ResponsiveInvoiceWrapperProps {
  desktopView: ReactNode;
  mobileView: ReactNode;
}

export const ResponsiveInvoiceWrapper = ({
  desktopView,
  mobileView,
}: ResponsiveInvoiceWrapperProps) => {
  return (
    <>
      <div className="hidden lg:block h-full">{desktopView}</div>
      <div className="lg:hidden h-full">{mobileView}</div>
    </>
  );
};

export default ResponsiveInvoiceWrapper;
