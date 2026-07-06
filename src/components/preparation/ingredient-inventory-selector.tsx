import { InventoryItemCombobox } from "./inventory-item-combobox";
import type { Ingredient, InventoryCategory, InventoryItem, Unit } from "@/types";

type IngredientInventorySelectorProps = {
  ingredient: Ingredient;
  inventoryItems: InventoryItem[];
  onChange: (ingredient: Ingredient) => void;
  onQuickCreateInventoryItem: (
    name: string,
    category: InventoryCategory,
    unit: Unit,
  ) => Promise<InventoryItem | null>;
};

export function IngredientInventorySelector({
  ingredient,
  inventoryItems,
  onChange,
  onQuickCreateInventoryItem,
}: IngredientInventorySelectorProps) {
  return (
    <InventoryItemCombobox
      inventoryItems={inventoryItems}
      selectedItemId={ingredient.inventoryItemId}
      unit={ingredient.unit}
      value={ingredient.name}
      onCreateItem={onQuickCreateInventoryItem}
      onSelect={(item) =>
        onChange({
          ...ingredient,
          inventoryItemId: item.id,
          name: item.name,
          unit: item.unit,
        })
      }
    />
  );
}
