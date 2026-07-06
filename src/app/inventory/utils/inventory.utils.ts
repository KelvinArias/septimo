import type { InventoryCategory, InventoryItem } from "@/app/inventory/types/inventory";
import { slugify } from "@/utils";

export type InventoryFilterState = {
  search: string;
  category: "All" | InventoryCategory;
  lowOnly: boolean;
  activeOnly: boolean;
};

export function isInventoryLowStock(item: InventoryItem) {
  return item.minimumQuantity > 0 && item.currentQuantity <= item.minimumQuantity;
}

export function normalizeInventoryName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function findDuplicateInventoryItem(
  items: InventoryItem[],
  name: string,
  currentItemId?: string,
) {
  const normalizedName = normalizeInventoryName(name);

  if (!normalizedName) return undefined;

  return items.find(
    (item) =>
      item.id !== currentItemId && normalizeInventoryName(item.name) === normalizedName,
  );
}

export function searchInventoryItems(items: InventoryItem[], search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return items;
  }

  return items.filter((item) =>
    [
      item.name,
      item.category,
      item.supplier ?? "",
      item.storageLocation ?? "",
      item.sku ?? "",
      item.notes ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch),
  );
}

export function filterInventoryItems(items: InventoryItem[], filters: InventoryFilterState) {
  return searchInventoryItems(items, filters.search).filter((item) => {
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesLowStock = !filters.lowOnly || isInventoryLowStock(item);
    const matchesActive = !filters.activeOnly || item.active;

    return matchesCategory && matchesLowStock && matchesActive;
  });
}

export function createInventoryItemDraft(): InventoryItem {
  return {
    id: "",
    name: "",
    category: "Fruit",
    currentQuantity: 0,
    minimumQuantity: 0,
    unit: "units",
    dateAdded: "",
    updatedAt: "",
    expirationDate: "",
    supplier: "",
    storageLocation: "",
    notes: "",
    parLevel: 0,
    costPerUnit: 0,
    sku: "",
    active: true,
  };
}

export function prepareInventoryItemForSave(item: InventoryItem): {
  item: InventoryItem;
  isNew: boolean;
} {
  const now = new Date().toISOString();
  const isNew = !item.id;

  return {
    isNew,
    item: {
      ...item,
      name: item.name.trim(),
      id: item.id || `raw-${slugify(item.name)}-${Date.now()}`,
      dateAdded: item.dateAdded || now,
      updatedAt: now,
    },
  };
}
