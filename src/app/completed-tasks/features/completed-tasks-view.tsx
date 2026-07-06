import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { formatDate } from "@/utils";
import type { Task } from "@/app/tasks/types/task";

type CompletedTasksViewProps = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

export function CompletedTasksView({ tasks, onDelete, onEdit }: CompletedTasksViewProps) {
  return (
    <div className="space-y-3 px-4 py-5 md:px-5 lg:px-7">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 rounded-lg border border-[#e3dfd7] bg-white px-4 py-4 text-sm text-[#8a857d]"
        >
          <CheckCircle2 className="mt-0.5 text-[#27b98a]" size={16} />
          <div className="min-w-0 flex-1">
            <p className="font-medium line-through">{task.title}</p>
            {task.description && <p className="mt-1 text-xs">{task.description}</p>}
            <p className="mt-2 text-xs">Completed {formatDate(task.completedAt)}</p>
          </div>
          <div className="flex gap-1">
            <IconButton label="Edit task" onClick={() => onEdit(task)}>
              <Pencil size={15} />
            </IconButton>
            <IconButton label="Delete task" onClick={() => onDelete(task.id)}>
              <Trash2 size={15} />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
