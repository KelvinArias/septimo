import { seedItem } from "./seed-item.ts";

const garnishes = [
  ["toasted-coconut", "Toasted Coconut", 2500, 600, 3500, 0.018, "2027-05-31"],
] as const;

export const garnishSeeds = garnishes.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit, expirationDate]) =>
  seedItem({
    seedId: `garnish-${seedId}`,
    name,
    category: "Garnish",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "g",
    expirationDate,
    supplier: "Sysco",
    storageLocation: "Dry Storage - Garnish Shelf",
    costPerUnit,
    sku: `GN-${seedId.toUpperCase()}`,
    notes: `${name} prepared for consistent cocktail presentation and fast service pickup.`,
  }),
);
