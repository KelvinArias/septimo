import { PreparationFilters } from "./preparation-filters";
import { PreparationTable } from "./preparation-table";
import type { PreparationFilterState } from "@/lib/utils";
import type { PreparationCategory, PreparationItem } from "@/types";

type PreparationDashboardProps = {
  filters: PreparationFilterState;
  items: PreparationItem[];
  onCategoryChange: (category: "All" | PreparationCategory) => void;
  onDelete: (id: string) => void;
  onEdit: (item: PreparationItem) => void;
  onLowOnlyChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onView: (item: PreparationItem) => void;
};

export function PreparationDashboard({
  filters,
  items,
  onCategoryChange,
  onDelete,
  onEdit,
  onLowOnlyChange,
  onSearchChange,
  onUpdateAmount,
  onView,
}: PreparationDashboardProps) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 py-5 md:px-5 lg:px-7">
      <PreparationFilters
        category={filters.category}
        lowOnly={filters.lowOnly}
        search={filters.search}
        onCategoryChange={onCategoryChange}
        onLowOnlyChange={onLowOnlyChange}
        onSearchChange={onSearchChange}
      />
      <PreparationTable
        items={items}
        onDelete={onDelete}
        onEdit={onEdit}
        onUpdateAmount={onUpdateAmount}
        onView={onView}
      />
    </div>
  );
}
