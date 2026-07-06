import type { Unit } from "@/types";

export type PreparationCategory =
  | "Cordial"
  | "Syrup"
  | "Foam"
  | "Carbonated Drink"
  | "Pre-Batch"
  | "Infusion"
  | "Mix"
  | "Other";

export type Ingredient = {
  inventoryItemId?: string;
  name: string;
  amount: number;
  unit: Unit;
};

export type PreparationItem = {
  id: string;
  name: string;
  category: PreparationCategory;
  currentAmount: number;
  minimumAmount: number;
  unit: Unit;
  ingredients: Ingredient[];
  prepInstructions?: string;
  shelfLife?: string;
  dateMade?: string;
  expirationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
