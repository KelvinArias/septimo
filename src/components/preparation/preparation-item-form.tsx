import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { IngredientList } from "./ingredient-list";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SelectControl } from "@/components/ui/select-control";
import { UnitSelect } from "@/components/ui/unit-select";
import { preparationCategories } from "@/lib/constants";
import { getNumberInputValue, parseNumberInputValue } from "@/lib/utils";
import type { InventoryItem, PreparationCategory, PreparationItem, Unit } from "@/types";

type PreparationItemFormProps = {
  item: PreparationItem;
  inventoryItems: InventoryItem[];
  onChange: (item: PreparationItem) => void;
  onClose: () => void;
  onQuickCreateInventoryItem: (
    name: string,
    category: InventoryItem["category"],
    unit: Unit,
  ) => Promise<InventoryItem | null>;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
};

export function PreparationItemForm({
  item,
  inventoryItems,
  onChange,
  onClose,
  onQuickCreateInventoryItem,
  onSave,
}: PreparationItemFormProps) {
  return (
    <Modal
      title={item.id ? "Edit Preparation" : "Add Preparation"}
      subtitle={item.name || undefined}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={onSave}>
        <Field label="Name" required>
          <input
            className="input"
            placeholder="e.g. Passion Fruit Cordial"
            required
            value={item.name}
            onChange={(event) => onChange({ ...item, name: event.target.value })}
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Category" required>
            <SelectControl
              value={item.category}
              onChange={(event) =>
                onChange({ ...item, category: event.target.value as PreparationCategory })
              }
            >
              {preparationCategories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </SelectControl>
          </Field>
          <Field label="Unit" required>
            <UnitSelect
              value={item.unit}
              onChange={(unit) => onChange({ ...item, unit })}
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Current Amount" required>
            <input
              className="input"
              min="0"
              required
              step="0.1"
              type="number"
              value={getNumberInputValue(item.currentAmount)}
              onChange={(event) =>
                onChange({
                  ...item,
                  currentAmount: parseNumberInputValue(event.target.value),
                })
              }
            />
          </Field>
          <Field label="Minimum Required" required>
            <input
              className="input"
              min="0"
              required
              step="0.1"
              type="number"
              value={getNumberInputValue(item.minimumAmount)}
              onChange={(event) =>
                onChange({
                  ...item,
                  minimumAmount: parseNumberInputValue(event.target.value),
                })
              }
            />
          </Field>
        </div>
        <Field label="Notes">
          <textarea
            className="input min-h-20 resize-none py-3"
            placeholder="Shelf life, preparation tips, storage instructions..."
            value={item.notes ?? ""}
            onChange={(event) => onChange({ ...item, notes: event.target.value })}
          />
        </Field>
        <IngredientList
          ingredients={item.ingredients}
          inventoryItems={inventoryItems}
          onChange={(ingredients) => onChange({ ...item, ingredients })}
          onQuickCreateInventoryItem={onQuickCreateInventoryItem}
        />
        <div className="grid gap-2 border-t border-[#e4e0d8] pt-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus size={16} /> {item.id ? "Save Changes" : "Add Preparation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
