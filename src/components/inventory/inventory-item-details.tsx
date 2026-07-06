import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metric } from "@/components/ui/metric";
import { Modal } from "@/components/ui/modal";
import { LowStockBadge } from "@/components/ui/status-badge";
import { formatDate, isInventoryLowStock } from "@/lib/utils";
import type { InventoryItem } from "@/types";

type InventoryItemDetailsProps = {
  item: InventoryItem;
  onClose: () => void;
  onEdit: () => void;
};

export function InventoryItemDetails({ item, onClose, onEdit }: InventoryItemDetailsProps) {
  return (
    <Modal
      title={item.name}
      subtitle={`${item.category} - Added ${formatDate(item.dateAdded)}`}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Current" value={`${item.currentQuantity} ${item.unit}`} />
          <Metric label="Minimum" value={`${item.minimumQuantity} ${item.unit}`} />
          <div className="rounded-md border border-[#e3dfd7] bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a857d]">
              Status
            </p>
            <div className="mt-1">
              <LowStockBadge low={isInventoryLowStock(item)} />
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Detail label="Supplier" value={item.supplier} />
          <Detail label="Storage" value={item.storageLocation} />
          <Detail label="Expiration" value={formatDate(item.expirationDate)} />
          <Detail label="Par Level" value={item.parLevel ? `${item.parLevel} ${item.unit}` : ""} />
          <Detail label="Cost Per Unit" value={formatCurrency(item.costPerUnit)} />
          <Detail label="SKU" value={item.sku} />
        </div>
        {item.notes && <p className="text-sm leading-6 text-[#5f5a52]">{item.notes}</p>}
        <p className="text-xs text-[#8a857d]">Last updated {formatDate(item.updatedAt)}</p>
        <div className="grid gap-2 border-t border-[#e4e0d8] pt-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil size={16} /> Edit Item
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-[#e3dfd7] bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a857d]">{label}</p>
      <p className="mt-1 min-h-5 text-sm text-[#2f2b26]">{value || "Not set"}</p>
    </div>
  );
}

function formatCurrency(value?: number) {
  if (!value) return "";

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}
