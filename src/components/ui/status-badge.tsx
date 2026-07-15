import { AlertCircle, AlertTriangle, Check } from "lucide-react";
import type { StockStatus } from "@/utils";

type StockStatusBadgeProps = {
  showIcon?: boolean;
  status: StockStatus;
};

export function StockStatusBadge({ showIcon = true, status }: StockStatusBadgeProps) {
  if (status === "out-of-stock") {
    return (
      <span className="inline-flex w-fit whitespace-nowrap items-center gap-1 rounded border border-[#f1a4a4] bg-[#fff1f1] px-1.5 py-1 text-[11px] font-medium text-[#b42318] md:px-2 md:text-xs">
        {showIcon && <AlertCircle size={13} />} Out of Stock
      </span>
    );
  }

  if (status === "low-stock") {
    return (
      <span className="inline-flex w-fit whitespace-nowrap items-center gap-1 rounded border border-[#f5d190] bg-[#fff8e8] px-1.5 py-1 text-[11px] font-medium text-[#b65700] md:px-2 md:text-xs">
        {showIcon && <AlertTriangle size={13} />} Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit whitespace-nowrap items-center gap-1 rounded border border-[#bdebd7] bg-[#edfdf6] px-1.5 py-1 text-[11px] font-medium text-[#00845a] md:px-2 md:text-xs">
      {showIcon && <Check size={13} />} Available
    </span>
  );
}

type LowStockBadgeProps = {
  low: boolean;
};

export function LowStockBadge({ low }: LowStockBadgeProps) {
  return <StockStatusBadge status={low ? "low-stock" : "available"} />;
}
