import { Filter } from "lucide-react";
import { PreparationSearch } from "./preparation-search";
import { SelectControl } from "@/components/ui/select-control";
import { preparationCategories } from "@/lib/constants";
import { classNames } from "@/utils";
import type { PreparationCategory } from "@/app/preparation/types/preparation";

type PreparationFiltersProps = {
  category: "All" | PreparationCategory;
  lowOnly: boolean;
  search: string;
  onCategoryChange: (category: "All" | PreparationCategory) => void;
  onLowOnlyChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
};

export function PreparationFilters({
  category,
  lowOnly,
  search,
  onCategoryChange,
  onLowOnlyChange,
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
      <button
        className={classNames(
          "inline-flex min-h-11 max-w-37 flex-[1_1_140px] items-center justify-center gap-2 rounded-md border px-3 text-sm transition lg:min-h-9",
          lowOnly
            ? "border-[#f1b56a] bg-[#fff5e8] text-[#b65700]"
            : "border-[#d8d4cc] bg-white text-[#635d55] hover:border-[#bbb4aa]",
        )}
        onClick={() => onLowOnlyChange(!lowOnly)}
      >
        <Filter size={15} /> Low Stock
      </button>
    </div>
  );
}
