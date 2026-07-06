"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/app/features/navigation/app-shell";
import { RouteErrorBanner, RouteLoadingBanner } from "@/app/features/route-feedback";
import { getErrorMessage, upsertById } from "@/app/features/route-state.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import { TaskForm } from "@/app/tasks/features/task-form";
import { TaskList } from "@/app/tasks/features/task-list";
import type { Task } from "@/app/tasks/types/task";
import {
  createTaskDraft,
  getGeneratedLowStockTasks,
  markTaskCompleted,
  prepareTaskForSave,
} from "@/app/tasks/utils/task.utils";
import { Button } from "@/components/ui/button";
import { fetchPreparationItems } from "@/services/preparation-client.service";
import { fetchTasks, removeTask, saveTask } from "@/services/task-client.service";

export function TasksPageContent() {
  const [preparations, setPreparations] = useState<PreparationItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dismissedAutoTaskIds, setDismissedAutoTaskIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedPreparations, loadedTasks] = await Promise.all([
          fetchPreparationItems(),
          fetchTasks(),
        ]);

        setPreparations(loadedPreparations);
        setTasks(loadedTasks);
        setApiMessage(null);
      } catch (error) {
        setApiMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, []);

  const generatedTasks = useMemo(
    () =>
      getGeneratedLowStockTasks(preparations, tasks).filter(
        (task) => !dismissedAutoTaskIds.includes(task.id),
      ),
    [dismissedAutoTaskIds, preparations, tasks],
  );
  const allTasks = useMemo(() => [...generatedTasks, ...tasks], [generatedTasks, tasks]);
  const pendingTasks = allTasks.filter((task) => task.status === "pending");

  async function handleSaveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTask) return;

    const { task, isNew } = prepareTaskForSave(editingTask);

    try {
      const savedTask = await saveTask(task, isNew);
      setDismissedAutoTaskIds((current) => current.filter((taskId) => taskId !== savedTask.id));
      setTasks((current) => upsertById(current, savedTask));
      setEditingTask(null);
      setApiMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
    }
  }

  async function handleCompleteTask(task: Task) {
    const completedTask = markTaskCompleted(task);
    const isNewAutoTask = task.id.startsWith("auto-");

    try {
      const savedTask = await saveTask(completedTask, isNewAutoTask);
      setTasks((current) => upsertById(current, savedTask));
      setDismissedAutoTaskIds((current) => current.filter((taskId) => taskId !== task.id));
      setApiMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (taskId.startsWith("auto-")) {
      setDismissedAutoTaskIds((current) =>
        current.includes(taskId) ? current : [...current, taskId],
      );
      return;
    }

    try {
      await removeTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setApiMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
    }
  }

  return (
    <AppShell
      activeView="tasks"
      action={
        <Button
          className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
          onClick={() => setEditingTask(createTaskDraft())}
        >
          <Plus size={18} /> <span className="hidden lg:inline">Add Task</span>
        </Button>
      }
      pendingTaskCount={pendingTasks.length}
      subtitle={`${pendingTasks.length} pending - ${generatedTasks.length} from low prep`}
      title="Tasks"
    >
      {apiMessage && <RouteErrorBanner message={apiMessage} />}
      {isLoading && <RouteLoadingBanner />}

      <TaskList
        generatedCount={generatedTasks.length}
        preparations={preparations}
        tasks={pendingTasks}
        onComplete={handleCompleteTask}
        onDelete={handleDeleteTask}
        onEdit={setEditingTask}
      />

      {editingTask && (
        <TaskForm
          task={editingTask}
          onChange={setEditingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </AppShell>
  );
}
