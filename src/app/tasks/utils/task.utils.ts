import type { InventoryItem } from "@/app/inventory/types/inventory";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import type { Task } from "@/app/tasks/types/task";
import { slugify } from "@/utils";
import { getInventoryStockStatus } from "@/app/inventory/utils/inventory.utils";
import {
  getPreparationStockStatus,
  isCannotProduce,
  isProductionTrackedPreparation,
} from "@/app/preparation/utils/preparation.utils";

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (firstTask, secondTask) =>
      new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime(),
  );
}

export function createLowStockTask(item: PreparationItem): Task {
  return {
    id: `auto-${item.id}`,
    title: item.name,
    description: `Current stock is ${item.currentAmount}${item.unit}. Prepare at least ${Math.max(
      item.minimumAmount - item.currentAmount,
      item.minimumAmount,
    )}${item.unit} to bring levels up.`,
    status: "pending",
    createdAt: new Date().toISOString(),
    linkedPreparationItemId: item.id,
  };
}

export function createInventoryRestockTask(
  item: InventoryItem,
  affectedPreparations: PreparationItem[],
): Task {
  const affectedPreBatchNames = affectedPreparations.map((preparation) => preparation.name);
  const affectedDescription =
    affectedPreBatchNames.length > 0
      ? `\n\nAffected pre-batches:\n${affectedPreBatchNames.map((name) => `- ${name}`).join("\n")}`
      : "";

  return {
    id: `auto-restock-${item.id}`,
    title: `Restock ${item.name}`,
    description: `Status: Out of Stock.${affectedDescription}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    linkedInventoryItemId: item.id,
    affectedPreparationItemIds: affectedPreparations.map((preparation) => preparation.id),
  };
}

export function getTaskPreparationItemId(task: Task, preparations: PreparationItem[] = []) {
  if (task.linkedPreparationItemId) return task.linkedPreparationItemId;

  if (
    task.linkedInventoryItemId &&
    preparations.some((preparation) => preparation.id === task.linkedInventoryItemId)
  ) {
    return task.linkedInventoryItemId;
  }

  return undefined;
}

export function getTaskInventoryItemId(task: Task, inventoryItems: InventoryItem[] = []) {
  if (
    task.linkedInventoryItemId &&
    inventoryItems.some((inventoryItem) => inventoryItem.id === task.linkedInventoryItemId)
  ) {
    return task.linkedInventoryItemId;
  }

  return undefined;
}

export function getAffectedPreBatchesForInventoryItem(
  item: InventoryItem,
  preparations: PreparationItem[],
) {
  return preparations.filter(
    (preparation) =>
      isProductionTrackedPreparation(preparation) &&
      preparation.ingredients.some((ingredient) => ingredient.inventoryItemId === item.id),
  );
}

export function getGeneratedLowStockTasks(
  items: PreparationItem[],
  tasks: Task[],
  inventoryItems: InventoryItem[] = [],
) {
  return items
    .filter((item) => getPreparationStockStatus(item) !== "available")
    .filter((item) => !isCannotProduce(item, inventoryItems))
    .filter((item) => !tasks.some((task) => getTaskPreparationItemId(task, items) === item.id))
    .map(createLowStockTask);
}

export function getGeneratedInventoryRestockTasks(
  inventoryItems: InventoryItem[],
  preparations: PreparationItem[],
  tasks: Task[],
) {
  return inventoryItems
    .filter((item) => getInventoryStockStatus(item) === "out-of-stock")
    .filter(
      (item) =>
        !tasks.some((task) => getTaskInventoryItemId(task, inventoryItems) === item.id),
    )
    .map((item) =>
      createInventoryRestockTask(
        item,
        getAffectedPreBatchesForInventoryItem(item, preparations),
      ),
    );
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
