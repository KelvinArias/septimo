import { Plus, X } from "lucide-react";
import { emptyIngredient, units } from "@/lib/constants";
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
        <button
          className="inline-flex items-center gap-1 text-xs font-medium text-[#5e5a53]"
          type="button"
          onClick={() => onChange([...ingredients, { ...emptyIngredient }])}
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={`${index}-${ingredient.name}`}
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
              value={ingredient.amount}
              onChange={(event) =>
                updateIngredient(index, {
                  ...ingredient,
                  amount: Number(event.target.value),
                })
              }
            />
            <select
              className="input"
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
            </select>
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
