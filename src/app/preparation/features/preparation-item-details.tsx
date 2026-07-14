import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metric } from "@/components/ui/metric";
import { Modal } from "@/components/ui/modal";
import { StockStatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/utils";
import { getPreparationStockStatus } from "@/app/preparation/utils/preparation.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";

type PreparationItemDetailsProps = {
  item: PreparationItem;
  onClose: () => void;
  onEdit: () => void;
};

export function PreparationItemDetails({ item, onClose, onEdit }: PreparationItemDetailsProps) {
  return (
    <Modal
      title={item.name}
      subtitle={`${item.category} - Created ${formatDate(item.createdAt)}`}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Current" value={`${item.currentAmount} ${item.unit}`} />
          <Metric label="Minimum" value={`${item.minimumAmount} ${item.unit}`} />
          <div className="rounded-md border border-[#e3dfd7] bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a857d]">
              Status
            </p>
            <div className="mt-1">
              <StockStatusBadge status={getPreparationStockStatus(item)} />
            </div>
          </div>
        </div>
        {item.notes && <p className="text-sm leading-6 text-[#5f5a52]">{item.notes}</p>}
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#6f6960]">
            Ingredients
          </h3>
          <div className="divide-y divide-[#e7e2da] rounded-md border border-[#e3dfd7] bg-white">
            {item.ingredients.map((ingredient) => (
              <div
                key={`${ingredient.name}-${ingredient.amount}-${ingredient.unit}`}
                className="flex justify-between px-3 py-2 text-sm"
              >
                <span>{ingredient.name}</span>
                <span className="font-mono text-[#5f5a52]">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#8a857d]">Last updated {formatDate(item.updatedAt)}</p>
        <div className="grid gap-2 border-t border-[#e4e0d8] pt-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil size={16} /> Edit Preparation
          </Button>
        </div>
      </div>
    </Modal>
  );
}
