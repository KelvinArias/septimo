export type InventoryCategory =
  | "Pre-batch"
  | "Cordial"
  | "Foam"
  | "Syrup"
  | "Juice"
  | "Garnish"
  | "Other";

export type Unit = "quantity" | "g" | "oz" | "ml" | "L" | "bottles" | "units";

export type Ingredient = {
  name: string;
  amount: number;
  unit: Unit;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  currentAmount: number;
  minimumAmount: number;
  unit: Unit;
  ingredients: Ingredient[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
