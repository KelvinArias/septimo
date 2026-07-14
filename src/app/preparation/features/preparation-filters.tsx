import { PreparationSearch } from "./preparation-search";
import { SelectControl } from "@/components/ui/select-control";
import { preparationCategories } from "@/lib/constants";
import type { PreparationCategory } from "@/app/preparation/types/preparation";
import type { StockStatusFilter } from "@/utils";

type PreparationFiltersProps = {
  category: "All" | PreparationCategory;
  stockStatus: StockStatusFilter;
  search: string;
  onCategoryChange: (category: "All" | PreparationCategory) => void;
  onStockStatusChange: (status: StockStatusFilter) => void;
  onSearchChange: (value: string) => void;
};

export function PreparationFilters({
  category,
  stockStatus,
  search,
  onCategoryChange,
  onStockStatusChange,
  onSearchChange,
}: PreparationFiltersProps) {
  return (
    <div className="mb-5 flex min-w-0 flex-wrap items-center gap-2">
      <PreparationSearch
        className="md:max-w-[250px] w-full flex-[1_1_220px] md:mr-auto"
        search={search}
        onSearchChange={onSearchChange}
      />
      <SelectControl
        className="h-9"
        containerClassName="max-w-[175px] flex-[1_1_170px]"
        value={category}
        onChange={(event) =>
          onCategoryChange(event.target.value as "All" | PreparationCategory)
        }
      >
        <option value="All">All Categories</option>
        {preparationCategories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </SelectControl>
      <SelectControl
        className="h-9"
        containerClassName="max-w-[175px] flex-[1_1_170px]"
        value={stockStatus}
        onChange={(event) => onStockStatusChange(event.target.value as StockStatusFilter)}
      >
        <option value="All">All Statuses</option>
        <option value="available">Available</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </SelectControl>
    </div>
  );
}
