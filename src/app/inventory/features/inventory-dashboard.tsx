import { InventoryFilters } from "./inventory-filters";
import { InventoryTable } from "./inventory-table";
import type { InventoryFilterState } from "@/app/inventory/utils/inventory.utils";
import type { InventoryCategory, InventoryItem } from "@/app/inventory/types/inventory";
import type { StockStatusFilter } from "@/utils";

type InventoryDashboardProps = {
  filters: InventoryFilterState;
  items: InventoryItem[];
  onActiveOnlyChange: (value: boolean) => void;
  onCategoryChange: (category: "All" | InventoryCategory) => void;
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onStockStatusChange: (status: StockStatusFilter) => void;
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
  onStockStatusChange,
  onSearchChange,
  onUpdateQuantity,
  onView,
}: InventoryDashboardProps) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 py-5 md:px-5 lg:px-7">
      <InventoryFilters
        activeOnly={filters.activeOnly}
        category={filters.category}
        search={filters.search}
        stockStatus={filters.stockStatus}
        onActiveOnlyChange={onActiveOnlyChange}
        onCategoryChange={onCategoryChange}
        onSearchChange={onSearchChange}
        onStockStatusChange={onStockStatusChange}
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
