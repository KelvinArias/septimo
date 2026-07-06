import type { Ingredient, InventoryCategory, Unit } from "@/types";

export const inventoryCategories: InventoryCategory[] = [
  "Pre-batch",
  "Cordial",
  "Foam",
  "Syrup",
  "Juice",
  "Garnish",
  "Other",
];

export const units: Unit[] = ["quantity", "g", "oz", "ml", "L", "bottles", "units"];

export const emptyIngredient: Ingredient = { name: "", amount: 0, unit: "g" };
