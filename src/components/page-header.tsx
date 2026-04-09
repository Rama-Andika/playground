import { Heading } from "./heading";
import { SubHeading } from "./sub-heading";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  className?: string; // Desktop-specific class for padding/layout
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <>
      {/* Desktop Header */}
      <div className={`hidden md:flex flex-col gap-1 border-b pb-6 mb-6 ${className}`}>
        <div className="text-main">
          <Heading>{title}</Heading>
        </div>
        <SubHeading>{subtitle}</SubHeading>
      </div>

      {/* Mobile Header (High Contrast Card with accent border) */}
      <div className="md:hidden mx-4 mt-6 mb-2 p-6 rounded-xl bg-white border-l-4 border-main shadow-md animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="text-main mb-1">
          <Heading>{title}</Heading>
        </div>
        <SubHeading>{subtitle}</SubHeading>
      </div>
    </>
  );
}
