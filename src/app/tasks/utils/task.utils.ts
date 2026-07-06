import type { PreparationItem } from "@/app/preparation/types/preparation";
import type { Task } from "@/app/tasks/types/task";
import { slugify } from "@/utils";
import { isLowStock } from "@/app/preparation/utils/preparation.utils";

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

export function getTaskPreparationItemId(task: Task) {
  return task.linkedPreparationItemId ?? task.linkedInventoryItemId;
}

export function getGeneratedLowStockTasks(items: PreparationItem[], tasks: Task[]) {
  return items
    .filter(isLowStock)
    .filter((item) => !tasks.some((task) => getTaskPreparationItemId(task) === item.id))
    .map(createLowStockTask);
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
