import { AlertOctagon, CheckCircle2 } from "lucide-react";
import { classNames } from "@/utils";
import type { ProductionStatus } from "@/app/preparation/utils/preparation.utils";

type ProductionStatusBadgeProps = {
  missingIngredientNames: string[];
  status: ProductionStatus;
  showCanProduce?: boolean;
};

export function ProductionStatusBadge({
  missingIngredientNames,
  status,
  showCanProduce = false,
}: ProductionStatusBadgeProps) {
  if (status === "can-produce") {
    if (!showCanProduce) return null;

    return (
      <span className="inline-flex w-fit items-center gap-1 rounded border border-[#d7efe5] bg-[#f5fcf8] px-1.5 py-1 text-[11px] font-medium text-[#2a7d5b] md:px-2 md:text-xs">
        <CheckCircle2 size={13} /> Can Produce
      </span>
    );
  }

  return (
    <span
      className={classNames(
        "inline-flex w-fit max-w-full items-center gap-1 rounded border border-[#e68a8a]",
        "bg-[#fff5f5] px-1.5 py-1 text-[11px] font-medium text-[#a21919] md:px-2 md:text-xs",
      )}
      title={`Missing: ${missingIngredientNames.join(", ")}`}
    >
      <AlertOctagon className="shrink-0" size={13} />
      <span className="shrink-0">Cannot Produce</span>
      {missingIngredientNames.length > 0 && (
        <span className="min-w-0 truncate text-[#7a1f1f]">
          Missing: {missingIngredientNames.join(", ")}
        </span>
      )}
    </span>
  );
}
