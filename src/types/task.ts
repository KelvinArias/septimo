export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  linkedPreparationItemId?: string;
  /** Legacy Phase 1 compatibility for tasks created before Inventory became Preparation. */
  linkedInventoryItemId?: string;
};
