import dayjs from "dayjs";

interface InvoiceInfoCardProps {
  number?: string;
  date?: Date | string;
}

export const InvoiceInfoCard = ({ date }: InvoiceInfoCardProps) => {
  return (
    <div className="px-4 py-4 flex flex-col gap-3 mt-2">
      <div className="flex items-center justify-between bg-white rounded-3xl border border-dotted border-gray-200">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 block">
            Date
          </span>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">
            {date ? dayjs(date).format("ddd, DD MMM YYYY") : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
