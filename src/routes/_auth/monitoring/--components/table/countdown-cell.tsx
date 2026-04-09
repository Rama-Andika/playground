import { useCountdown } from "@/hooks/useCountDown";
import cn from "classnames";

type CountdownCellProps = {
  endTime: string;
  className?: string;
};

export function CountdownCell({ endTime, className }: CountdownCellProps) {
  const { secondsLeft, timeLabel } = useCountdown(endTime);

  const color =
    secondsLeft <= 5 * 60
      ? "text-red-600 font-bold"
      : secondsLeft <= 10 * 60
        ? "text-orange-600 font-semibold"
        : "text-green-600";

  return (
    <div className={cn("text-right pr-2 font-mono", color, className)}>{timeLabel}</div>
  );
}
