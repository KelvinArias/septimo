import { getAppCollections } from "@/lib/mongodb";
import type { InventoryItem } from "@/types";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const collections = await getAppCollections();

  return await collections.inventory
    .find({}, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function createInventoryItem(item: InventoryItem) {
  const collections = await getAppCollections();

  await collections.inventory.insertOne(item);

  return item;
}

export async function updateInventoryItem(id: string, item: InventoryItem) {
  const collections = await getAppCollections();

  await collections.inventory.updateOne({ id }, { $set: item }, { upsert: true });

  return item;
}

export async function deleteInventoryItem(id: string) {
  const collections = await getAppCollections();

  await collections.inventory.deleteOne({ id });

  return { deleted: true };
}
