import type { Ingredient, PreparationCategory, Unit } from "@/types";

export const preparationCategories: PreparationCategory[] = [
  "Cordial",
  "Syrup",
  "Foam",
  "Carbonated Drink",
  "Pre-Batch",
  "Infusion",
  "Mix",
  "Other",
];

export const units: Unit[] = ["quantity", "g", "oz", "ml", "L", "bottles", "units"];

export const emptyIngredient: Ingredient = { name: "", amount: 0, unit: "g" };
