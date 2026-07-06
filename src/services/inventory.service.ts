import { getAppCollections, withoutMongoId } from "@/lib/mongodb";
import { normalizeInventoryName } from "@/app/inventory/utils/inventory.utils";
import { slugify } from "@/utils";
import { DuplicateInventoryNameError } from "@/lib/api-errors";
import type { InventoryItem } from "@/app/inventory/types/inventory";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const collections = await getAppCollections();

  return await collections.inventory
    .find({}, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function createInventoryItem(item: InventoryItem) {
  const collections = await getAppCollections();
  const now = new Date().toISOString();
  const itemForSave = {
    ...item,
    id: item.id || `raw-${slugify(item.name)}-${Date.now()}`,
    name: item.name.trim(),
    dateAdded: item.dateAdded || now,
    updatedAt: now,
  };
  const existingItems = await getInventoryItems();
  const duplicate = existingItems.find(
    (currentItem) =>
      normalizeInventoryName(currentItem.name) === normalizeInventoryName(itemForSave.name),
  );

  if (duplicate) {
    throw new DuplicateInventoryNameError(itemForSave.name);
  }

  await collections.inventory.insertOne(itemForSave);

  return itemForSave;
}

export async function updateInventoryItem(id: string, item: InventoryItem) {
  const collections = await getAppCollections();
  const itemForSave = {
    ...item,
    id,
    name: item.name.trim(),
    updatedAt: new Date().toISOString(),
  };
  const existingItems = await getInventoryItems();
  const duplicate = existingItems.find(
    (currentItem) =>
      currentItem.id !== id &&
      normalizeInventoryName(currentItem.name) === normalizeInventoryName(itemForSave.name),
  );

  if (duplicate) {
    throw new DuplicateInventoryNameError(itemForSave.name);
  }

  await collections.inventory.updateOne(
    { id },
    { $set: withoutMongoId(itemForSave) },
    { upsert: true },
  );

  return itemForSave;
}

export async function deleteInventoryItem(id: string) {
  const collections = await getAppCollections();

  await collections.inventory.deleteOne({ id });

  return { deleted: true };
}
