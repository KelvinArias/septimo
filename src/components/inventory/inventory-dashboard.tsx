import { InventoryFilters } from "./inventory-filters";
import { InventoryTable } from "./inventory-table";
import type { InventoryFilterState } from "@/lib/utils";
import type { InventoryCategory, InventoryItem } from "@/types";

type InventoryDashboardProps = {
  filters: InventoryFilterState;
  items: InventoryItem[];
  onActiveOnlyChange: (value: boolean) => void;
  onCategoryChange: (category: "All" | InventoryCategory) => void;
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onLowOnlyChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onView: (item: InventoryItem) => void;
};

export function InventoryDashboard({
  filters,
  items,
  onActiveOnlyChange,
  onCategoryChange,
  onDelete,
  onEdit,
  onLowOnlyChange,
  onSearchChange,
  onUpdateQuantity,
  onView,
}: InventoryDashboardProps) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 py-5 md:px-5 lg:px-7">
      <InventoryFilters
        activeOnly={filters.activeOnly}
        category={filters.category}
        lowOnly={filters.lowOnly}
        search={filters.search}
        onActiveOnlyChange={onActiveOnlyChange}
        onCategoryChange={onCategoryChange}
        onLowOnlyChange={onLowOnlyChange}
        onSearchChange={onSearchChange}
      />
      <InventoryTable
        items={items}
        onDelete={onDelete}
        onEdit={onEdit}
        onUpdateQuantity={onUpdateQuantity}
        onView={onView}
      />
    </div>
  );
}
