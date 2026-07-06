import type {
  PreparationCategory,
  PreparationItem,
} from "@/app/preparation/types/preparation";
import { emptyIngredient } from "@/lib/constants";
import { slugify } from "@/utils";

export type PreparationFilterState = {
  search: string;
  category: "All" | PreparationCategory;
  lowOnly: boolean;
};

export function isLowStock(item: PreparationItem) {
  return item.currentAmount <= item.minimumAmount;
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

export function filterPreparationItems(items: PreparationItem[], filters: PreparationFilterState) {
  return searchPreparationItems(items, filters.search).filter((item) => {
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesLowStock = !filters.lowOnly || isLowStock(item);

    return matchesCategory && matchesLowStock;
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
