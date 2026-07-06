import { Filter, Power } from "lucide-react";
import { InventorySearch } from "./inventory-search";
import { SelectControl } from "@/components/ui/select-control";
import { inventoryCategories } from "@/lib/constants";
import { classNames } from "@/lib/utils";
import type { InventoryCategory } from "@/types";

type InventoryFiltersProps = {
  activeOnly: boolean;
  category: "All" | InventoryCategory;
  lowOnly: boolean;
  search: string;
  onActiveOnlyChange: (value: boolean) => void;
  onCategoryChange: (category: "All" | InventoryCategory) => void;
  onLowOnlyChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
};

export function InventoryFilters({
  activeOnly,
  category,
  lowOnly,
  search,
  onActiveOnlyChange,
  onCategoryChange,
  onLowOnlyChange,
  onSearchChange,
}: InventoryFiltersProps) {
  return (
    <div className="mb-5 flex min-w-0 flex-wrap items-center gap-2">
      <InventorySearch
        className="md:max-w-[250px] w-full flex-[1_1_220px] md:mr-auto"
        search={search}
        onSearchChange={onSearchChange}
      />
      <SelectControl
        className="h-9"
        containerClassName="max-w-[175px] flex-[1_1_170px]"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value as "All" | InventoryCategory)}
      >
        <option value="All">All Categories</option>
        {inventoryCategories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </SelectControl>
      <FilterButton active={lowOnly} onClick={() => onLowOnlyChange(!lowOnly)}>
        <Filter size={15} /> Low Stock
      </FilterButton>
      <FilterButton active={activeOnly} onClick={() => onActiveOnlyChange(!activeOnly)}>
        <Power size={15} /> Active
      </FilterButton>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={classNames(
        "inline-flex min-h-11 max-w-37 flex-[1_1_120px] items-center justify-center gap-2 rounded-md border px-3 text-sm transition lg:min-h-9",
        active
          ? "border-[#f1b56a] bg-[#fff5e8] text-[#b65700]"
          : "border-[#d8d4cc] bg-white text-[#635d55] hover:border-[#bbb4aa]",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
