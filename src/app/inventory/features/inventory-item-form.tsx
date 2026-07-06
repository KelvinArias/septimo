import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SelectControl } from "@/components/ui/select-control";
import { UnitSelect } from "@/components/ui/unit-select";
import { inventoryCategories } from "@/lib/constants";
import { getNumberInputValue, parseNumberInputValue } from "@/utils";
import type { InventoryCategory, InventoryItem } from "@/app/inventory/types/inventory";

type InventoryItemFormProps = {
  item: InventoryItem;
  nameError?: string;
  onChange: (item: InventoryItem) => void;
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
};

export function InventoryItemForm({
  item,
  nameError,
  onChange,
  onClose,
  onSave,
}: InventoryItemFormProps) {
  return (
    <Modal
      title={item.id ? "Edit Inventory Item" : "Add Inventory Item"}
      subtitle={item.name || undefined}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={onSave}>
        <Field label="Name" required>
          <input
            className="input"
            placeholder="e.g. Lime, Aperol, Mint"
            required
            value={item.name}
            onChange={(event) => onChange({ ...item, name: event.target.value })}
          />
          {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Category" required>
            <SelectControl
              value={item.category}
              onChange={(event) =>
                onChange({ ...item, category: event.target.value as InventoryCategory })
              }
            >
              {inventoryCategories.map((value) => (
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
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Current Quantity">
            <input
              className="input"
              min="0"
              step="0.1"
              type="number"
              value={getNumberInputValue(item.currentQuantity)}
              onChange={(event) =>
                onChange({
                  ...item,
                  currentQuantity: parseNumberInputValue(event.target.value),
                })
              }
            />
          </Field>
          <Field label="Minimum Quantity">
            <input
              className="input"
              min="0"
              step="0.1"
              type="number"
              value={getNumberInputValue(item.minimumQuantity)}
              onChange={(event) =>
                onChange({
                  ...item,
                  minimumQuantity: parseNumberInputValue(event.target.value),
                })
              }
            />
          </Field>
          <Field label="Par Level">
            <input
              className="input"
              min="0"
              step="0.1"
              type="number"
              value={getNumberInputValue(item.parLevel ?? 0)}
              onChange={(event) =>
                onChange({ ...item, parLevel: parseNumberInputValue(event.target.value) })
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Supplier">
            <input
              className="input"
              placeholder="Vendor or supplier"
              value={item.supplier ?? ""}
              onChange={(event) => onChange({ ...item, supplier: event.target.value })}
            />
          </Field>
          <Field label="Storage Location">
            <input
              className="input"
              placeholder="Walk-in, dry storage, bar fridge"
              value={item.storageLocation ?? ""}
              onChange={(event) => onChange({ ...item, storageLocation: event.target.value })}
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Expiration Date">
            <input
              className="input"
              type="date"
              value={item.expirationDate ?? ""}
              onChange={(event) => onChange({ ...item, expirationDate: event.target.value })}
            />
          </Field>
          <Field label="Cost Per Unit">
            <input
              className="input"
              min="0"
              step="0.01"
              type="number"
              value={getNumberInputValue(item.costPerUnit ?? 0)}
              onChange={(event) =>
                onChange({ ...item, costPerUnit: parseNumberInputValue(event.target.value) })
              }
            />
          </Field>
          <Field label="SKU">
            <input
              className="input"
              placeholder="Internal code"
              value={item.sku ?? ""}
              onChange={(event) => onChange({ ...item, sku: event.target.value })}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 rounded-md border border-[#e3dfd7] bg-white px-3 py-2 text-sm text-[#5f5a52]">
          <input
            checked={item.active}
            className="h-4 w-4 accent-[#111111]"
            type="checkbox"
            onChange={(event) => onChange({ ...item, active: event.target.checked })}
          />
          Active inventory item
        </label>
        <Field label="Notes">
          <textarea
            className="input min-h-20 resize-none py-3"
            placeholder="Storage notes, receiving notes, quality details..."
            value={item.notes ?? ""}
            onChange={(event) => onChange({ ...item, notes: event.target.value })}
          />
        </Field>
        <div className="grid gap-2 border-t border-[#e4e0d8] pt-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus size={16} /> {item.id ? "Save Changes" : "Add Item"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
