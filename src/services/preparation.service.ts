import { getAppCollections } from "@/lib/mongodb";
import type { PreparationItem } from "@/types";

export async function getPreparationItems(): Promise<PreparationItem[]> {
  const collections = await getAppCollections();

  return await collections.preparations
    .find({}, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function createPreparationItem(item: PreparationItem) {
  const collections = await getAppCollections();

  await collections.preparations.insertOne(item);

  return item;
}

export async function updatePreparationItem(id: string, item: PreparationItem) {
  const collections = await getAppCollections();

  await collections.preparations.updateOne({ id }, { $set: item }, { upsert: true });

  return item;
}

export async function deletePreparationItem(id: string) {
  const collections = await getAppCollections();

  await collections.preparations.deleteOne({ id });
  await collections.tasks.deleteMany({
    $or: [{ linkedPreparationItemId: id }, { linkedInventoryItemId: id }],
  });

  return { deleted: true };
}
