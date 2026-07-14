import { seedItem } from "./seed-item.ts";

const juices = [
  ["lemon-juice", "Lemon Juice", 4000, 1200, 6000, 0.006, "2026-07-13"],
  ["coconut-water", "Coconut Water", 8000, 2400, 10000, 0.003, "2027-03-31"],
] as const;

export const juiceSeeds = juices.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit, expirationDate]) =>
  seedItem({
    seedId: `juice-${seedId}`,
    name,
    category: "Juice",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "ml",
    expirationDate,
    supplier: name === "Lemon Juice"
      ? "House Prep"
      : "Sysco",
    storageLocation: "Walk-in Cooler - Juice Shelf",
    costPerUnit,
    sku: `JU-${seedId.toUpperCase()}`,
    notes: `${name} portioned for cocktail batching, brunch service, mocktails, and prep recipes.`,
  }),
);
