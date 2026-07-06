import type { InventoryCategory, InventoryItem, Task } from "@/types";
import { emptyIngredient } from "./constants";

export type InventoryFilterState = {
  search: string;
  category: "All" | InventoryCategory;
  lowOnly: boolean;
};

export function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function isLowStock(item: InventoryItem) {
  return item.currentAmount <= item.minimumAmount;
}

export function searchInventoryItems(items: InventoryItem[], search: string) {
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

export function filterInventoryItems(items: InventoryItem[], filters: InventoryFilterState) {
  return searchInventoryItems(items, filters.search).filter((item) => {
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesLowStock = !filters.lowOnly || isLowStock(item);

    return matchesCategory && matchesLowStock;
  });
}

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (firstTask, secondTask) =>
      new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime(),
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createLowStockTask(item: InventoryItem): Task {
  return {
    id: `auto-${item.id}`,
    title: item.name,
    description: `Current stock is ${item.currentAmount}${item.unit}. Prepare at least ${Math.max(
      item.minimumAmount - item.currentAmount,
      item.minimumAmount,
    )}${item.unit} to bring levels up.`,
    status: "pending",
    createdAt: new Date().toISOString(),
    linkedInventoryItemId: item.id,
  };
}

export function getGeneratedLowStockTasks(items: InventoryItem[], tasks: Task[]) {
  return items
    .filter(isLowStock)
    .filter((item) => !tasks.some((task) => task.linkedInventoryItemId === item.id))
    .map(createLowStockTask);
}

export function createInventoryItemDraft(): InventoryItem {
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

export function createTaskDraft(): Task {
  return {
    id: "",
    title: "",
    description: "",
    status: "pending",
    createdAt: "",
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
      id: item.id || `inv-${slugify(item.name)}-${Date.now()}`,
      ingredients: item.ingredients.filter(
        (ingredient) => ingredient.name.trim() && ingredient.amount > 0,
      ),
      createdAt: item.createdAt || now,
      updatedAt: now,
    },
  };
}

export function prepareTaskForSave(task: Task): { task: Task; isNew: boolean } {
  const now = new Date().toISOString();
  const isNew = !task.id;

  return {
    isNew,
    task: {
      ...task,
      id: task.id || `task-${slugify(task.title)}-${Date.now()}`,
      createdAt: task.createdAt || now,
    },
  };
}

export function markTaskCompleted(task: Task): Task {
  return {
    ...task,
    id: task.id.startsWith("auto-") ? `task-${task.id}-${Date.now()}` : task.id,
    status: "completed",
    completedAt: new Date().toISOString(),
  };
}
