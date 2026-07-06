import { Plus } from "lucide-react";
import { useState } from "react";
import { SelectControl } from "@/components/ui/select-control";
import { UnitSelect } from "@/components/ui/unit-select";
import { inventoryCategories } from "@/lib/constants";
import type { InventoryCategory, InventoryItem, Unit } from "@/types";

type QuickCreateInventoryItemProps = {
  defaultName: string;
  defaultUnit: Unit;
  isSaving: boolean;
  onCreate: (name: string, category: InventoryCategory, unit: Unit) => Promise<InventoryItem | null>;
};

export function QuickCreateInventoryItem({
  defaultName,
  defaultUnit,
  isSaving,
  onCreate,
}: QuickCreateInventoryItemProps) {
  const [category, setCategory] = useState<InventoryCategory>("Other");
  const [unit, setUnit] = useState<Unit>(defaultUnit);

  return (
    <div className="space-y-2 border-t border-[#eeeae2] bg-[#fbfaf8] p-2">
      <div className="grid gap-2 sm:grid-cols-[1fr_92px_auto]">
        <SelectControl
          className="h-9"
          value={category}
          onChange={(event) => setCategory(event.target.value as InventoryCategory)}
        >
          {inventoryCategories.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </SelectControl>
        <UnitSelect className="h-9" value={unit} onChange={setUnit} />
        <button
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#111111] px-3 text-xs font-semibold text-white transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving || !defaultName.trim()}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => void onCreate(defaultName, category, unit)}
        >
          <Plus size={13} /> {isSaving ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
