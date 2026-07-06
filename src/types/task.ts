export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  linkedInventoryItemId?: string;
};
