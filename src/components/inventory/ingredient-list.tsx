import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectControl } from "@/components/ui/select-control";
import { emptyIngredient, units } from "@/lib/constants";
import { getNumberInputValue, parseNumberInputValue } from "@/lib/utils";
import type { Ingredient, Unit } from "@/types";

type IngredientListProps = {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
};

export function IngredientList({ ingredients, onChange }: IngredientListProps) {
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
            <input
              className="input"
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(event) =>
                updateIngredient(index, { ...ingredient, name: event.target.value })
              }
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
            <SelectControl
              value={ingredient.unit}
              onChange={(event) =>
                updateIngredient(index, {
                  ...ingredient,
                  unit: event.target.value as Unit,
                })
              }
            >
              {units.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </SelectControl>
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
