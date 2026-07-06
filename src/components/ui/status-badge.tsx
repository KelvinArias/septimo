import { AlertTriangle, Check } from "lucide-react";

type LowStockBadgeProps = {
  low: boolean;
};

export function LowStockBadge({ low }: LowStockBadgeProps) {
  return low ? (
    <span className="inline-flex w-fit whitespace-nowrap items-center gap-1 rounded border border-[#f5d190] bg-[#fff8e8] px-1.5 py-1 text-[11px] font-medium text-[#b65700] md:px-2 md:text-xs">
      <AlertTriangle size={13} /> Low Stock
    </span>
  ) : (
    <span className="inline-flex w-fit whitespace-nowrap items-center gap-1 rounded border border-[#bdebd7] bg-[#edfdf6] px-1.5 py-1 text-[11px] font-medium text-[#00845a] md:px-2 md:text-xs">
      <Check size={13} /> Available
    </span>
  );
}
