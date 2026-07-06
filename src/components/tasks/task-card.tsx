import { AlertTriangle, Check, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { classNames, formatDate } from "@/lib/utils";
import type { InventoryItem, Task } from "@/types";

type TaskCardProps = {
  inventory: InventoryItem[];
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

export function TaskCard({ inventory, task, onComplete, onDelete, onEdit }: TaskCardProps) {
  const item = inventory.find((inventoryItem) => inventoryItem.id === task.linkedInventoryItemId);
  return (
    <div
      className={classNames(
        "w-full min-w-0 max-w-full rounded-lg border border-[#e3dfd7] bg-white px-4 py-4 text-sm shadow-[0_1px_0_rgba(17,17,17,0.02)]",
        item && "border-t-4 border-t-[#f4a000]",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-start gap-3">
          <button
            className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#d7d2c9] bg-white text-transparent transition hover:border-[#27b98a] hover:text-[#27b98a]"
            title="Mark task as completed"
            onClick={() => onComplete(task)}
          >
            <Check size={11} />
          </button>
          <p className="font-semibold leading-5">{task.title}</p>
          <div className="flex -mt-2 -mr-2 shrink-0 gap-1">
            <IconButton label="Edit task" onClick={() => onEdit(task)}>
              <Pencil size={15} />
            </IconButton>
            <IconButton label="Delete task" onClick={() => onDelete(task.id)}>
              <Trash2 size={15} />
            </IconButton>
          </div>
        </div>
        {task.description && (
          <p className="mt-4 text-xs leading-5 text-[#5f5a52]">{task.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8a857d]">
          <span>{formatDate(task.createdAt)}</span>
          {item && (
            <span className="inline-flex items-center gap-1 rounded bg-[#fff3df] px-2 py-1 text-[#d06500]">
              <AlertTriangle size={12} /> {item.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
