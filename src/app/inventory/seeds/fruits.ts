import { seedItem } from "./seed-item.ts";

const fruits = [
  ["lemon", "Lemon", 120, 36, 150, 0.38, "2026-07-17"],
  ["fresh-raspberry", "Fresh Raspberry", 3000, 900, 4000, 0.012, "2026-07-10"],
] as const;

export const fruitSeeds = fruits.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit, expirationDate]) =>
  seedItem({
    seedId: `fruit-${seedId}`,
    name,
    category: "Fruit",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: name === "Fresh Raspberry" ? "g" : "units",
    expirationDate,
    supplier: "FreshPoint Produce",
    storageLocation: name.includes("Raspberry")
      ? "Walk-in Cooler - Berry Shelf"
      : "Walk-in Cooler - Fruit Shelf",
    costPerUnit,
    sku: `FR-${seedId.toUpperCase().replaceAll("-", "-")}`,
    notes: `${name} stocked for fresh prep, cocktail garnish, juice, and seasonal bar builds.`,
  }),
);
