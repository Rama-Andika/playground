import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import DatePicker, { type DatePickerProps } from "react-datepicker";

type Props = DatePickerProps & {
  className?: string;
};
export function ReactDatePicker({ className, ...props }: Props) {
  return (
    <DatePicker
      showIcon
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      icon={<Calendar />}
      className={cn(
        "ps-8! placeholder:ps-2 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border border-slate-300 bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus:border-main",
        className,
      )}
      {...props}
    />
  );
}
