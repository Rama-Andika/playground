import { formatNumberWithDecimals } from "@/utils/format-number";
import ButtonSave from "@/components/button/ButtonSave";

interface MobileStickyBottomBarProps {
  total: number;
  isPending: boolean;
  handleSave: () => void;
  isDraft?: boolean;
  children?: React.ReactNode; // For Status Control dropdown
}

export const MobileStickyBottomBar = ({
  total,
  isPending,
  handleSave,
  isDraft = true,
  children,
}: MobileStickyBottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 p-4 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] mb-safe">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Grand Total
          </span>
          <span className="text-lg font-black text-gray-800 tracking-tighter">
            Rp {formatNumberWithDecimals(total ?? 0)}
          </span>
        </div>

        {isDraft && (
          <div className="flex items-center gap-3">
            {children}
            <div className="flex-1">
              <ButtonSave
                disabled={isPending}
                loading={isPending}
                onClick={handleSave}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
