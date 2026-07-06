import { Search } from "lucide-react";

type InventorySearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function InventorySearch({ search, onSearchChange }: InventorySearchProps) {
  return (
    <label className="relative w-full min-w-0 max-w-md lg:max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d877f]" size={16} />
      <input
        className="h-9 w-full rounded-md border border-[#d8d4cc] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9d9890] focus:border-[#aaa398]"
        placeholder="Search items..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>
  );
}
