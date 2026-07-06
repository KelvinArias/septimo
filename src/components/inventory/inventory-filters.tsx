import { Filter } from "lucide-react";
import { InventorySearch } from "./inventory-search";
import { inventoryCategories } from "@/lib/constants";
import { classNames } from "@/lib/utils";
import type { InventoryCategory } from "@/types";

type InventoryFiltersProps = {
  category: "All" | InventoryCategory;
  lowOnly: boolean;
  search: string;
  onCategoryChange: (category: "All" | InventoryCategory) => void;
  onLowOnlyChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
};

export function InventoryFilters({
  category,
  lowOnly,
  search,
  onCategoryChange,
  onLowOnlyChange,
  onSearchChange,
}: InventoryFiltersProps) {
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-3">
      <InventorySearch search={search} onSearchChange={onSearchChange} />
      <div className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible lg:pb-0">
        <select
          className="hidden h-9 rounded-md border border-[#d8d4cc] bg-white px-3 text-sm outline-none focus:border-[#aaa398] lg:block"
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value as "All" | InventoryCategory)
          }
        >
          <option value="All">All Categories</option>
          {inventoryCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Chip active={category === "All"} onClick={() => onCategoryChange("All")}>
          All Categories
        </Chip>
        {inventoryCategories.map((item) => (
          <Chip
            key={item}
            active={category === item}
            onClick={() => onCategoryChange(item)}
          >
            {item}
          </Chip>
        ))}
        <button
          className={classNames(
            "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm transition lg:min-h-9",
            lowOnly
              ? "border-[#f1b56a] bg-[#fff5e8] text-[#b65700]"
              : "border-[#d8d4cc] bg-white text-[#635d55] hover:border-[#bbb4aa]",
          )}
          onClick={() => onLowOnlyChange(!lowOnly)}
        >
          <Filter size={15} /> Low Stock
        </button>
      </div>
    </div>
  );
}

function Chip({
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
        "inline-flex min-h-11 shrink-0 items-center rounded-md border px-3 text-sm transition lg:hidden",
        active
          ? "border-[#111111] bg-[#111111] text-white"
          : "border-[#d8d4cc] bg-white text-[#5f5a52]",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
