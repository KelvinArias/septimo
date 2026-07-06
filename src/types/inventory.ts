export type InventoryCategory =
  | "Fruit"
  | "Juice"
  | "Alcohol"
  | "Garnish"
  | "Powder"
  | "Vegetable"
  | "Herb"
  | "Bottle"
  | "Can"
  | "Other";

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  currentQuantity: number;
  minimumQuantity: number;
  unit: string;
  dateAdded: string;
  updatedAt: string;
  expirationDate?: string;
  supplier?: string;
  storageLocation?: string;
  notes?: string;
  parLevel?: number;
  costPerUnit?: number;
  sku?: string;
  active: boolean;
};
