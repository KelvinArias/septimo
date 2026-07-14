import { seedItem } from "./seed-item.ts";

const liqueurs = [
  ["st-germain", "St-Germain", 3000, 750, 4500, 0.048],
] as const;

export const liqueurSeeds = liqueurs.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit]) =>
  seedItem({
    seedId: `liqueur-${seedId}`,
    name,
    category: "Alcohol",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "ml",
    expirationDate: "2030-12-31",
    supplier: "Southern Glazer's",
    storageLocation: "Back Bar - Liqueurs and Aperitifs",
    costPerUnit,
    sku: `AL-LIQ-${seedId.toUpperCase()}`,
    notes: `${name} kept for classic modifiers, dessert cocktails, spritzes, and signature drinks.`,
  }),
);
