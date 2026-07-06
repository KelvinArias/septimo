export type PreparationCategory =
  | "Cordial"
  | "Syrup"
  | "Foam"
  | "Carbonated Drink"
  | "Pre-Batch"
  | "Infusion"
  | "Mix"
  | "Other";

export type Unit = "quantity" | "g" | "oz" | "ml" | "L" | "bottles" | "units";

export type Ingredient = {
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
