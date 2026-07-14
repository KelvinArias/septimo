import type { InventoryItem } from "../types/inventory";

export const GENERIC_BAR_INVENTORY_SEED_SOURCE = "generic-bar-inventory-v1";

export type SeedInventoryItemInput = Omit<
  InventoryItem,
  "id" | "dateAdded" | "updatedAt" | "isSeed" | "seedSource" | "seedId" | "active"
> & {
  active?: boolean;
  seedId: string;
};

const seededAt = "2026-07-06T00:00:00.000Z";

export function seedItem(item: SeedInventoryItemInput): InventoryItem {
  return {
    ...item,
    id: `seed-bar-${item.seedId}`,
    dateAdded: seededAt,
    updatedAt: seededAt,
    active: item.active ?? true,
    isSeed: true,
    seedSource: GENERIC_BAR_INVENTORY_SEED_SOURCE,
    seedId: item.seedId,
  };
}
