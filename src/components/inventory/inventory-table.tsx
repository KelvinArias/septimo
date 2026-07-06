import { InventoryItemCard } from "./inventory-item-card";
import type { InventoryItem } from "@/types";

type InventoryTableProps = {
  items: InventoryItem[];
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onView: (item: InventoryItem) => void;
};

export function InventoryTable({
  items,
  onDelete,
  onEdit,
  onUpdateQuantity,
  onView,
}: InventoryTableProps) {
  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-2 lg:block lg:overflow-hidden lg:border-y lg:border-[#dedbd3]">
      <div className="hidden grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr_0.5fr_0.8fr_0.9fr] gap-4 px-0 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#756f67] lg:grid">
        <span>Name</span>
        <span>Category</span>
        <span>Current</span>
        <span>Minimum</span>
        <span>Unit</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      {items.map((item) => (
        <InventoryItemCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          onEdit={onEdit}
          onUpdateQuantity={onUpdateQuantity}
          onView={onView}
        />
      ))}
    </div>
  );
}
