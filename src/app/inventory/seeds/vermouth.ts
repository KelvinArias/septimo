import { seedItem } from "./seed-item.ts";

const vermouths = [
  ["cocchi-sweet-vermouth", "Cocchi Sweet Vermouth", 2, 1, 3, 0],
] as const;

export const vermouthSeeds = vermouths.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit]) =>
  seedItem({
    seedId: `vermouth-${seedId}`,
    name,
    category: "Alcohol",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "bottles",
    expirationDate: "2026-10-31",
    supplier: "Winebow",
    storageLocation: "Wine Fridge - Vermouth and Fortified",
    costPerUnit,
    sku: `AL-VER-${seedId.toUpperCase()}`,
    notes: `${name} refrigerated for martinis, Manhattans, aperitif pours, spritzes, and low-ABV cocktails.`,
  }),
);
