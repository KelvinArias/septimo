import type { InventoryItem } from "../types/inventory";
import { fruitSeeds } from "./fruits.ts";
import { garnishSeeds } from "./garnishes.ts";
import { juiceSeeds } from "./juices.ts";
import { liqueurSeeds } from "./liqueurs.ts";
import { otherSeeds } from "./other.ts";
import { powderSeeds } from "./powders.ts";
import { syrupSeeds } from "./syrups.ts";
import { vermouthSeeds } from "./vermouth.ts";
export { GENERIC_BAR_INVENTORY_SEED_SOURCE } from "./seed-item.ts";

export const genericBarInventorySeed: InventoryItem[] = [
  ...fruitSeeds,
  ...juiceSeeds,
  ...garnishSeeds,
  ...powderSeeds,
  ...syrupSeeds,
  ...liqueurSeeds,
  ...vermouthSeeds,
  ...otherSeeds,
];
