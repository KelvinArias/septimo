import { AlertTriangle } from "lucide-react";
import { TaskCard } from "./task-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getTaskPreparationItemId } from "@/app/tasks/utils/task.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import type { Task } from "@/app/tasks/types/task";

type TaskListProps = {
  generatedCount: number;
  preparations: PreparationItem[];
  tasks: Task[];
  onComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

export function TaskList({
  generatedCount,
  preparations,
  tasks,
  onComplete,
  onDelete,
  onEdit,
}: TaskListProps) {
  const lowStockTasks = tasks.filter(getTaskPreparationItemId);
  const generalTasks = tasks.filter((task) => !getTaskPreparationItemId(task));

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
