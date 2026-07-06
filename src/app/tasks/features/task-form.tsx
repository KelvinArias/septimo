import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import type { Task, TaskStatus } from "@/app/tasks/types/task";

type TaskFormProps = {
  task: Task;
  onChange: (task: Task) => void;
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
};

export function TaskForm({ task, onChange, onClose, onSave }: TaskFormProps) {
  return (
    <Modal
      title={task.id ? "Edit Task" : "Add Task"}
      subtitle={task.title || undefined}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={onSave}>
        <Field label="Title" required>
          <input
            className="input"
            placeholder="e.g. Polish cocktail coupes"
            required
            value={task.title}
            onChange={(event) => onChange({ ...task, title: event.target.value })}
          />
        </Field>
        <Field label="Description">
          <textarea
            className="input min-h-24 resize-none py-3"
            placeholder="Optional task details..."
            value={task.description}
            onChange={(event) => onChange({ ...task, description: event.target.value })}
          />
        </Field>
        <Field label="Status">
          <select
            className="input"
            value={task.status}
            onChange={(event) =>
              onChange({
                ...task,
                status: event.target.value as TaskStatus,
                completedAt:
                  event.target.value === "completed"
                    ? task.completedAt ?? new Date().toISOString()
                    : undefined,
              })
            }
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </Field>
        <div className="grid gap-2 border-t border-[#e4e0d8] pt-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus size={16} /> Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
