import type {
  Ingredient,
  PreparationCategory,
  PreparationItem,
} from "@/app/preparation/types/preparation";
import type { InventoryItem } from "@/app/inventory/types/inventory";
import { emptyIngredient } from "@/lib/constants";
import { getStockStatus, slugify } from "@/utils";
import type { StockStatusFilter } from "@/utils";

export type ProductionStatus = "can-produce" | "cannot-produce";
export type ProductionStatusFilter = "All" | ProductionStatus;

export type PreparationFilterState = {
  search: string;
  category: "All" | PreparationCategory;
  stockStatus: StockStatusFilter;
  productionStatus: ProductionStatusFilter;
};

export type ResolvedPreparationIngredient = Ingredient & {
  inventoryItem?: InventoryItem;
};

export function getPreparationStockStatus(item: PreparationItem) {
  return getStockStatus(item.currentAmount, item.minimumAmount);
}

export function isLowStock(item: PreparationItem) {
  return getPreparationStockStatus(item) === "low-stock";
}

export function isOutOfStock(item: PreparationItem) {
  return getPreparationStockStatus(item) === "out-of-stock";
}

export function isProductionTrackedPreparation(item: PreparationItem) {
  return item.category === "Pre-Batch";
}

export function resolvePreparationIngredients(
  item: PreparationItem,
  inventoryItems: InventoryItem[],
): ResolvedPreparationIngredient[] {
  const inventoryItemsById = new Map(inventoryItems.map((inventoryItem) => [inventoryItem.id, inventoryItem]));

  return item.ingredients.map((ingredient) => ({
    ...ingredient,
    inventoryItem: ingredient.inventoryItemId
      ? inventoryItemsById.get(ingredient.inventoryItemId)
      : undefined,
  }));
}

export function getMissingIngredients(
  item: PreparationItem,
  inventoryItems: InventoryItem[],
): ResolvedPreparationIngredient[] {
  return resolvePreparationIngredients(item, inventoryItems).filter((ingredient) => {
    const inventoryItem = ingredient.inventoryItem;

    return !inventoryItem || inventoryItem.currentQuantity <= 0;
  });
}

export function canProduce(item: PreparationItem, inventoryItems: InventoryItem[]) {
  return getMissingIngredients(item, inventoryItems).length === 0;
}

export function cannotProduce(item: PreparationItem, inventoryItems: InventoryItem[]) {
  return !canProduce(item, inventoryItems);
}

export function getProductionStatus(
  item: PreparationItem,
  inventoryItems: InventoryItem[],
): ProductionStatus {
  return cannotProduce(item, inventoryItems) ? "cannot-produce" : "can-produce";
}

export function getMissingIngredientNames(
  item: PreparationItem,
  inventoryItems: InventoryItem[],
) {
  return getMissingIngredients(item, inventoryItems).map(
    (ingredient) => ingredient.inventoryItem?.name ?? ingredient.name,
  );
}

export function getMissingIngredientDetails(
  item: PreparationItem,
  inventoryItems: InventoryItem[],
) {
  return getMissingIngredients(item, inventoryItems).map((ingredient) => ({
    amount: ingredient.amount,
    name: ingredient.inventoryItem?.name ?? ingredient.name,
    unit: ingredient.unit,
  }));
}

export function isCannotProduce(item: PreparationItem, inventoryItems: InventoryItem[]) {
  return isProductionTrackedPreparation(item) && cannotProduce(item, inventoryItems);
}

export function searchPreparationItems(items: PreparationItem[], search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return items;
  }

  return items.filter((item) =>
    [item.name, item.category, item.notes ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch),
  );
}

export function filterPreparationItems(
  items: PreparationItem[],
  filters: PreparationFilterState,
  inventoryItems: InventoryItem[] = [],
) {
  return searchPreparationItems(items, filters.search).filter((item) => {
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesStockStatus =
      filters.stockStatus === "All" || getPreparationStockStatus(item) === filters.stockStatus;
    const matchesProductionStatus =
      filters.productionStatus === "All" ||
      (isProductionTrackedPreparation(item) &&
        (filters.productionStatus === "can-produce"
          ? canProduce(item, inventoryItems)
          : cannotProduce(item, inventoryItems)));

    return matchesCategory && matchesStockStatus && matchesProductionStatus;
  });
}

export function createPreparationItemDraft(): PreparationItem {
  return {
    id: "",
    name: "",
    category: "Syrup",
    currentAmount: 0,
    minimumAmount: 0,
    unit: "ml",
    ingredients: [{ ...emptyIngredient }],
    notes: "",
    createdAt: "",
    updatedAt: "",
  };
}

export function preparePreparationItemForSave(item: PreparationItem): {
  item: PreparationItem;
  isNew: boolean;
} {
  const now = new Date().toISOString();
  const isNew = !item.id;

  return {
    isNew,
    item: {
      ...item,
      id: item.id || `prep-${slugify(item.name)}-${Date.now()}`,
      ingredients: item.ingredients.filter(
        (ingredient) => ingredient.name.trim() && ingredient.amount > 0,
      ),
      createdAt: item.createdAt || now,
      updatedAt: now,
    },
  };
}
