import { PreparationFilters } from "./preparation-filters";
import { PreparationTable } from "./preparation-table";
import type { InventoryItem } from "@/app/inventory/types/inventory";
import type {
  PreparationFilterState,
  ProductionStatusFilter,
} from "@/app/preparation/utils/preparation.utils";
import type { PreparationCategory, PreparationItem } from "@/app/preparation/types/preparation";
import type { StockStatusFilter } from "@/utils";

type PreparationDashboardProps = {
  filters: PreparationFilterState;
  inventoryItems: InventoryItem[];
  items: PreparationItem[];
  onCategoryChange: (category: "All" | PreparationCategory) => void;
  onDelete: (id: string) => void;
  onEdit: (item: PreparationItem) => void;
  onProductionStatusChange: (status: ProductionStatusFilter) => void;
  onStockStatusChange: (status: StockStatusFilter) => void;
  onSearchChange: (value: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onView: (item: PreparationItem) => void;
};

export function PreparationDashboard({
  filters,
  inventoryItems,
  items,
  onCategoryChange,
  onDelete,
  onEdit,
  onProductionStatusChange,
  onStockStatusChange,
  onSearchChange,
  onUpdateAmount,
  onView,
}: PreparationDashboardProps) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 py-5 md:px-5 lg:px-7">
      <PreparationFilters
        category={filters.category}
        productionStatus={filters.productionStatus}
        search={filters.search}
        stockStatus={filters.stockStatus}
        onCategoryChange={onCategoryChange}
        onProductionStatusChange={onProductionStatusChange}
        onSearchChange={onSearchChange}
        onStockStatusChange={onStockStatusChange}
      />
      <PreparationTable
        inventoryItems={inventoryItems}
        items={items}
        onDelete={onDelete}
        onEdit={onEdit}
        onUpdateAmount={onUpdateAmount}
        onView={onView}
      />
    </div>
  );
}
