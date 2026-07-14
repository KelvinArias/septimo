import { seedItem } from "./seed-item.ts";

const powders = [
  ["citric-acid", "Citric Acid", 3000, 800, 4000, 0.009],
  ["malic-acid", "Malic Acid", 1600, 450, 2200, 0.014],
  ["tartaric-acid", "Tartaric Acid", 1200, 350, 1600, 0.018],
  ["granulated-sugar", "Granulated Sugar", 10000, 2500, 14000, 0.004],
  ["methylcellulose", "Methylcellulose", 500, 150, 800, 0.085],
  ["xanthan-gum", "Xanthan Gum", 500, 150, 800, 0.05],
] as const;

export const powderSeeds = powders.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit]) =>
  seedItem({
    seedId: `powder-${seedId}`,
    name,
    category: "Powder",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "g",
    expirationDate: "2028-12-31",
    supplier: "US Foods",
    storageLocation: "Dry Storage - Spice and Powder Shelf",
    costPerUnit,
    sku: `PW-${seedId.toUpperCase()}`,
    notes: `${name} measured by gram for rims, house blends, syrups, infusions, and batch prep.`,
  }),
);
