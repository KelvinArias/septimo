import { Plus, X } from "lucide-react";
import { IngredientInventorySelector } from "./ingredient-inventory-selector";
import { Button } from "@/components/ui/button";
import { UnitSelect } from "@/components/ui/unit-select";
import { emptyIngredient } from "@/lib/constants";
import { getNumberInputValue, parseNumberInputValue } from "@/lib/utils";
import type { Ingredient, InventoryCategory, InventoryItem, Unit } from "@/types";

type IngredientListProps = {
  ingredients: Ingredient[];
  inventoryItems: InventoryItem[];
  onChange: (ingredients: Ingredient[]) => void;
  onQuickCreateInventoryItem: (
    name: string,
    category: InventoryCategory,
    unit: Unit,
  ) => Promise<InventoryItem | null>;
};

export function IngredientList({
  ingredients,
  inventoryItems,
  onChange,
  onQuickCreateInventoryItem,
}: IngredientListProps) {
  function updateIngredient(index: number, ingredient: Ingredient) {
    onChange(
      ingredients.map((current, currentIndex) =>
        currentIndex === index ? ingredient : current,
      ),
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6f6960]">
          Ingredients
        </p>
        <Button
          className="min-h-9 px-3 text-xs lg:min-h-9"
          variant="secondary"
          type="button"
          onClick={() => onChange([...ingredients, { ...emptyIngredient }])}
        >
          <Plus size={14} /> Add Ingredient
        </Button>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-md bg-[#f4f2ef] p-3 sm:grid-cols-[1fr_90px_92px_32px] sm:bg-transparent sm:p-0"
          >
            <IngredientInventorySelector
              ingredient={ingredient}
              inventoryItems={inventoryItems}
              onChange={(nextIngredient) => updateIngredient(index, nextIngredient)}
              onQuickCreateInventoryItem={onQuickCreateInventoryItem}
            />
            <input
              className="input"
              min="0"
              placeholder="Amt"
              step="0.1"
              type="number"
              value={getNumberInputValue(ingredient.amount)}
              onChange={(event) =>
                updateIngredient(index, {
                  ...ingredient,
                  amount: parseNumberInputValue(event.target.value),
                })
              }
            />
            <UnitSelect
              value={ingredient.unit}
              onChange={(unit) =>
                updateIngredient(index, {
                  ...ingredient,
                  unit,
                })
              }
            />
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#d8d4cc] text-[#6b655d] sm:h-9 sm:min-h-9"
              title="Remove ingredient"
              type="button"
              onClick={() =>
                onChange(ingredients.filter((_, currentIndex) => currentIndex !== index))
              }
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
