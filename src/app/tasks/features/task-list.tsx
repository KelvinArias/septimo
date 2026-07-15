import { AlertTriangle } from "lucide-react";
import { TaskCard } from "./task-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { InventoryItem } from "@/app/inventory/types/inventory";
import {
  getTaskInventoryItemId,
  getTaskPreparationItemId,
} from "@/app/tasks/utils/task.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import type { Task } from "@/app/tasks/types/task";

type TaskListProps = {
  generatedCount: number;
  inventoryItems: InventoryItem[];
  preparations: PreparationItem[];
  tasks: Task[];
  onComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

export function TaskList({
  generatedCount,
  inventoryItems,
  preparations,
  tasks,
  onComplete,
  onDelete,
  onEdit,
}: TaskListProps) {
  const lowStockTasks = tasks.filter((task) => getTaskPreparationItemId(task, preparations));
  const restockTasks = tasks.filter((task) => getTaskInventoryItemId(task, inventoryItems));
  const generalTasks = tasks.filter(
    (task) =>
      !getTaskPreparationItemId(task, preparations) &&
      !getTaskInventoryItemId(task, inventoryItems),
  );

  return (
    <div className="space-y-7 px-4 py-5 md:px-5 lg:px-7">
      {lowStockTasks.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c45500]">
            <AlertTriangle size={14} /> Low Prep - {lowStockTasks.length} Tasks
          </h3>
          <div className="space-y-3">
            {lowStockTasks.map((task) => (
              <TaskCard
                key={task.id}
                inventoryItems={inventoryItems}
                preparations={preparations}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </section>
      )}

      {restockTasks.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#b42318]">
            <AlertTriangle size={14} /> Restock Inventory - {restockTasks.length} Tasks
          </h3>
          <div className="space-y-3">
            {restockTasks.map((task) => (
              <TaskCard
                key={task.id}
                inventoryItems={inventoryItems}
                preparations={preparations}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#756f67]">
          General Tasks
        </h3>
        <div className="space-y-3">
          {generalTasks.map((task) => (
            <TaskCard
              key={task.id}
              inventoryItems={inventoryItems}
              preparations={preparations}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
          {generalTasks.length === 0 && generatedCount === 0 && (
            <EmptyState message="No pending tasks. Service is clear." />
          )}
        </div>
      </section>
    </div>
  );
}
