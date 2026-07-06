import { InventoryFilters } from "./inventory-filters";
import { InventoryTable } from "./inventory-table";
import type { InventoryFilterState } from "@/lib/utils";
import type { InventoryCategory, InventoryItem } from "@/types";

type InventoryDashboardProps = {
  filters: InventoryFilterState;
  items: InventoryItem[];
  onCategoryChange: (category: "All" | InventoryCategory) => void;
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onLowOnlyChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onView: (item: InventoryItem) => void;
};

export function InventoryDashboard({
  filters,
  items,
  onCategoryChange,
  onDelete,
  onEdit,
  onLowOnlyChange,
  onSearchChange,
  onUpdateAmount,
  onView,
}: InventoryDashboardProps) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 py-5 md:px-5 lg:px-7">
      <InventoryFilters
        category={filters.category}
        lowOnly={filters.lowOnly}
        search={filters.search}
        onCategoryChange={onCategoryChange}
        onLowOnlyChange={onLowOnlyChange}
        onSearchChange={onSearchChange}
      />
      <InventoryTable
        items={items}
        onDelete={onDelete}
        onEdit={onEdit}
        onUpdateAmount={onUpdateAmount}
        onView={onView}
      />
    </div>
  );
}
