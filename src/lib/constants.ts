import type { InventoryCategory } from "@/app/inventory/types/inventory";
import type {
  Ingredient,
  PreparationCategory,
} from "@/app/preparation/types/preparation";
import type { Unit } from "@/types";

export const inventoryCategories: InventoryCategory[] = [
  "Fruit",
  "Juice",
  "Alcohol",
  "Garnish",
  "Powder",
  "Vegetable",
  "Herb",
  "Bottle",
  "Can",
  "Other",
];

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
