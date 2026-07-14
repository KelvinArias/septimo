import { seedItem } from "./seed-item.ts";

const syrups = [
  ["simple-syrup", "Simple Syrup", 4000, 1200, 6000, 0.0012, "House Prep"],
  ["simple-syrup-2-1", "Simple Syrup 2:1", 3000, 900, 4500, 0.0018, "House Prep"],
] as const;

export const syrupSeeds = syrups.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit, supplier]) =>
  seedItem({
    seedId: `syrup-${seedId}`,
    name,
    category: "Other",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "ml",
    expirationDate: "2026-07-20",
    supplier,
    storageLocation: supplier === "House Prep" ? "Lowboy Cooler - House Syrups" : "Dry Storage - Syrups",
    costPerUnit,
    sku: `SY-${seedId.toUpperCase()}`,
    notes: `${name} kept for balanced cocktail builds, coffee drinks, zero-proof drinks, and batched service.`,
  }),
);
