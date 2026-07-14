import { seedItem } from "./seed-item.ts";

const otherItems = [
  ["water", "Water", 20000, 5000, 30000, 0],
  ["ube", "Ube", 500, 100, 750, 0.04],
] as const;

export const otherSeeds = otherItems.map(([seedId, name, currentQuantity, minimumQuantity, parLevel, costPerUnit]) =>
  seedItem({
    seedId: `other-${seedId}`,
    name,
    category: "Other",
    currentQuantity,
    minimumQuantity,
    parLevel,
    unit: "ml",
    expirationDate: name === "Water" ? "2027-12-31" : "2027-05-31",
    supplier: name === "Water" ? "House Filtered Water" : "Specialty Produce",
    storageLocation: name === "Water" ? "Prep Station" : "Walk-in Cooler - Specialty Prep",
    costPerUnit,
    sku: `OT-${seedId.toUpperCase()}`,
    notes: `${name} stocked for the normalized Septimo Prep beverage program inventory seed.`,
  }),
);
