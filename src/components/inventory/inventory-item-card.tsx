import { Eye, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { InventoryAmountEditor } from "./inventory-amount-editor";
import { InventoryAmountUpdateModal } from "./inventory-amount-update-modal";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { LowStockBadge } from "@/components/ui/status-badge";
import { classNames, isInventoryLowStock } from "@/lib/utils";
import type { InventoryItem } from "@/types";

type InventoryItemCardProps = {
  item: InventoryItem;
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onView: (item: InventoryItem) => void;
};

export function InventoryItemCard({
  item,
  onDelete,
  onEdit,
  onUpdateQuantity,
  onView,
}: InventoryItemCardProps) {
  const low = isInventoryLowStock(item);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  return (
    <>
      <div
        className={classNames(
          "w-full min-w-0 max-w-full rounded-lg border bg-white p-4 text-sm shadow-[0_1px_0_rgba(17,17,17,0.02)] md:p-4 lg:grid lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:bg-transparent lg:p-0 lg:py-4 lg:shadow-none",
          "lg:grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr_0.5fr_0.8fr_0.9fr] lg:items-center lg:gap-4",
          low ? "border-[#f4b000] lg:bg-[#fbf7ef]" : "border-[#e3dfd7]",
          !item.active && "opacity-60",
        )}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 lg:block">
          <button className="min-w-0 text-left" onClick={() => onView(item)}>
            <p className="font-semibold">{item.name}</p>
            {item.storageLocation && (
              <p className="mt-1 text-xs text-[#7b756d]">{item.storageLocation}</p>
            )}
          </button>
          <div className="shrink-0 lg:hidden">
            <LowStockBadge low={low} />
          </div>
        </div>

        <span className="mt-3 inline-flex w-fit rounded bg-[#edf7ff] px-2 py-1 text-xs font-medium text-[#1261a6] lg:mt-0 lg:bg-white">
          {item.category}
        </span>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#eeeae2] pt-4 lg:hidden">
          <QuantityBlock label="Current" quantity={item.currentQuantity} unit={item.unit} low={low} />
          <QuantityBlock label="Minimum" quantity={item.minimumQuantity} unit={item.unit} />
        </div>

        <div className="hidden lg:block">
          <InventoryAmountEditor item={item} onUpdateQuantity={onUpdateQuantity} />
        </div>
        <span className="hidden font-mono text-sm lg:block">{item.minimumQuantity}</span>
        <span className="hidden text-[#635d55] lg:block">{item.unit}</span>
        <div className="hidden lg:block">
          <LowStockBadge low={low} />
        </div>

        <div className="mt-4 grid grid-cols-[1fr_1fr_38px_38px] gap-2 border-t border-[#eeeae2] pt-3 lg:mt-0 lg:flex lg:justify-end lg:border-t-0 lg:pt-0">
          <Button
            className="min-h-11 px-2 lg:hidden"
            variant="secondary"
            onClick={() => setIsUpdatingQuantity(true)}
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
          <IconButton label="View inventory details" onClick={() => onView(item)}>
            <Eye className="lg:hidden" size={15} />
            <Search className="hidden lg:block" size={15} />
          </IconButton>
          <IconButton label="Delete inventory item" onClick={() => onDelete(item.id)}>
            <Trash2 size={15} />
          </IconButton>
          <div className="hidden lg:flex lg:gap-1">
            <IconButton label="Edit inventory item" onClick={() => onEdit(item)}>
              <Pencil size={15} />
            </IconButton>
          </div>
        </div>
      </div>

      {isUpdatingQuantity && (
        <InventoryAmountUpdateModal
          item={item}
          onClose={() => setIsUpdatingQuantity(false)}
          onUpdateQuantity={onUpdateQuantity}
        />
      )}
    </>
  );
}

function QuantityBlock({
  label,
  low,
  quantity,
  unit,
}: {
  label: string;
  low?: boolean;
  quantity: number;
  unit: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f6960]">
        {label}
      </p>
      <p className={classNames("mt-1 font-mono text-lg font-semibold", low && "text-[#c45500]")}>
        {quantity} <span className="text-xs font-normal text-[#5f5a52]">{unit}</span>
      </p>
    </div>
  );
}
