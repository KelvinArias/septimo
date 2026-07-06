"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CompletedTasksView } from "@/app/completed-tasks/features/completed-tasks-view";
import { AppShell } from "@/app/features/navigation/app-shell";
import { RouteErrorBanner, RouteLoadingBanner } from "@/app/features/route-feedback";
import { getErrorMessage, upsertById } from "@/app/features/route-state.utils";
import { TaskForm } from "@/app/tasks/features/task-form";
import type { Task } from "@/app/tasks/types/task";
import { prepareTaskForSave } from "@/app/tasks/utils/task.utils";
import { fetchTasks, removeTask, saveTask } from "@/services/task-client.service";

export function CompletedTasksPageContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedTasks = await fetchTasks();

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

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status === "pending"),
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "completed"),
    [tasks],
  );

  async function handleSaveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTask) return;

    const { task, isNew } = prepareTaskForSave(editingTask);

    try {
      const savedTask = await saveTask(task, isNew);
      setTasks((current) => upsertById(current, savedTask));
      setEditingTask(null);
      setApiMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
    }
  }

  async function handleDeleteTask(taskId: string) {
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
      activeView="completed"
      pendingTaskCount={pendingTasks.length}
      subtitle={`${completedTasks.length} completed`}
      title="Completed Tasks"
    >
      {apiMessage && <RouteErrorBanner message={apiMessage} />}
      {isLoading && <RouteLoadingBanner />}

      <CompletedTasksView
        tasks={completedTasks}
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
