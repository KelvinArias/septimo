import { Eye, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { AmountEditor } from "./amount-editor";
import { AmountUpdateModal } from "./amount-update-modal";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { StockStatusBadge } from "@/components/ui/status-badge";
import { classNames } from "@/utils";
import type { StockStatus } from "@/utils";
import { getPreparationStockStatus } from "@/app/preparation/utils/preparation.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";

type PreparationItemCardProps = {
  item: PreparationItem;
  onDelete: (id: string) => void;
  onEdit: (item: PreparationItem) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onView: (item: PreparationItem) => void;
};

export function PreparationItemCard({
  item,
  onDelete,
  onEdit,
  onUpdateAmount,
  onView,
}: PreparationItemCardProps) {
  const stockStatus = getPreparationStockStatus(item);
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false);

  return (
    <>
      <div
        className={classNames(
          "w-full min-w-0 max-w-full rounded-lg border bg-white p-4 text-sm shadow-[0_1px_0_rgba(17,17,17,0.02)] md:p-4 lg:grid lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:bg-transparent lg:p-0 lg:py-4 lg:shadow-none",
          "lg:grid-cols-[2fr_0.8fr_0.7fr_0.7fr_0.45fr_0.8fr_1fr] lg:items-center lg:gap-4",
          stockStatus === "out-of-stock" && "border-[#d92d20] lg:bg-[#fff5f5]",
          stockStatus === "low-stock" && "border-[#f4b000] lg:bg-[#fbf7ef]",
          stockStatus === "available" && "border-[#e3dfd7]",
        )}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 lg:block">
          <button className="min-w-0 text-left" onClick={() => onView(item)}>
            <p className="font-semibold">{item.name}</p>
          </button>
          <div className="shrink-0 lg:hidden">
            <StockStatusBadge status={stockStatus} />
          </div>
        </div>

        <span className="mt-3 inline-flex w-fit rounded bg-[#f2fbf5] px-2 py-1 text-xs font-medium text-[#00845a] lg:mt-0 lg:bg-white lg:text-[#5b40d6]">
          {item.category}
        </span>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#eeeae2] pt-4 lg:hidden">
          <AmountBlock
            label="Current"
            amount={item.currentAmount}
            status={stockStatus}
            unit={item.unit}
          />
          <AmountBlock label="Minimum" amount={item.minimumAmount} unit={item.unit} />
        </div>

        <div className="hidden lg:block">
          <AmountEditor item={item} onUpdateAmount={onUpdateAmount} />
        </div>
        <span className="hidden font-mono text-sm lg:block">{item.minimumAmount}</span>
        <span className="hidden text-[#635d55] lg:block">{item.unit}</span>
        <div className="hidden lg:block">
          <StockStatusBadge status={stockStatus} />
        </div>

        {item.notes && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#5f5a52] lg:hidden">
            {item.notes}
          </p>
        )}

        <div className="mt-4 grid grid-cols-[1fr_1fr_38px_38px] gap-2 border-t border-[#eeeae2] pt-3 lg:mt-0 lg:flex lg:justify-end lg:border-t-0 lg:pt-0">
          <Button
            className="min-h-11 px-2 lg:hidden"
            variant="secondary"
            onClick={() => setIsUpdatingAmount(true)}
          >
            <RefreshCw size={14} /> Update
          </Button>
          <Button
            className="min-h-11 px-2 lg:hidden"
            variant="secondary"
            onClick={() => onEdit(item)}
          >
            <Pencil size={14} /> Edit
          </Button>
          <IconButton label="View preparation details" onClick={() => onView(item)}>
            <Eye className="lg:hidden" size={15} />
            <Search className="hidden lg:block" size={15} />
          </IconButton>
          <IconButton label="Delete preparation" onClick={() => onDelete(item.id)}>
            <Trash2 size={15} />
          </IconButton>
          <div className="hidden lg:flex lg:gap-1">
            <IconButton label="Edit preparation" onClick={() => onEdit(item)}>
              <Pencil size={15} />
            </IconButton>
          </div>
        </div>
      </div>

      {isUpdatingAmount && (
        <AmountUpdateModal
          item={item}
          onClose={() => setIsUpdatingAmount(false)}
          onUpdateAmount={onUpdateAmount}
        />
      )}
    </>
  );
}

function AmountBlock({
  amount,
  label,
  status,
  unit,
}: {
  amount: number;
  label: string;
  status?: StockStatus;
  unit: string;
}) {
  const isLowOrOut = status && status !== "available";

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f6960]">
        {label}
      </p>
      <p
        className={classNames(
          "mt-1 font-mono text-lg font-semibold",
          status === "out-of-stock" && "text-[#b42318]",
          status === "low-stock" && "text-[#c45500]",
          !isLowOrOut && "text-[#2f2b26]",
        )}
      >
        {amount} <span className="text-xs font-normal text-[#5f5a52]">{unit}</span>
      </p>
    </div>
  );
}
