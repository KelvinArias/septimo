"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { PreparationDashboard } from "./preparation/preparation-dashboard";
import { PreparationItemDetails } from "./preparation/preparation-item-details";
import { PreparationItemForm } from "./preparation/preparation-item-form";
import { AppShell } from "./layout/app-shell";
import { Button } from "./ui/button";
import { CompletedTasksView } from "./tasks/completed-tasks-view";
import { TaskForm } from "./tasks/task-form";
import { TaskList } from "./tasks/task-list";
import { Toast } from "./ui/toast";
import {
  createPreparationItemDraft,
  createTaskDraft,
  filterPreparationItems,
  getGeneratedLowStockTasks,
  isLowStock,
  markTaskCompleted,
  preparePreparationItemForSave,
  prepareTaskForSave,
} from "@/lib/utils";
import {
  fetchPreparationItems,
  removePreparationItem,
  savePreparationItem,
} from "@/services/preparation-client.service";
import { fetchTasks, removeTask, saveTask } from "@/services/task-client.service";
import type { AppView, PreparationCategory, PreparationItem, Task } from "@/types";

export function RestaurantPrepDashboard() {
  const [activeView, setActiveView] = useState<AppView>("preparation");
  const [items, setItems] = useState<PreparationItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | PreparationCategory>("All");
  const [lowOnly, setLowOnly] = useState(false);
  const [editingItem, setEditingItem] = useState<PreparationItem | null>(null);
  const [viewingItem, setViewingItem] = useState<PreparationItem | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dismissedAutoTaskIds, setDismissedAutoTaskIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [preparationItems, loadedTasks] = await Promise.all([
          fetchPreparationItems(),
          fetchTasks(),
        ]);

        setItems(preparationItems);
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

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 4000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const lowStockItems = useMemo(() => items.filter(isLowStock), [items]);
  const generatedTasks = useMemo(
    () =>
      getGeneratedLowStockTasks(items, tasks).filter(
        (task) => !dismissedAutoTaskIds.includes(task.id),
      ),
    [dismissedAutoTaskIds, items, tasks],
  );
  const allTasks = useMemo(() => [...generatedTasks, ...tasks], [generatedTasks, tasks]);
  const pendingTasks = allTasks.filter((task) => task.status === "pending");
  const completedTasks = allTasks.filter((task) => task.status === "completed");
  const filteredItems = filterPreparationItems(items, { search, category, lowOnly });

  async function handleSaveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingItem) return;

    const { item, isNew } = preparePreparationItemForSave(editingItem);

    try {
      await savePreparationItem(item, isNew);
      setItems((current) => upsertPreparationItem(current, item));
      setViewingItem(isNew ? null : item);
      setEditingItem(null);
      setApiMessage(null);
      setSuccessMessage(
        isNew ? `${item.name} was added to preparation.` : `${item.name} was updated.`,
      );
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleDeleteItem(itemId: string) {
    try {
      await removePreparationItem(itemId);
      setItems((current) => current.filter((item) => item.id !== itemId));
      setTasks((current) =>
        current.filter(
          (task) =>
            task.linkedPreparationItemId !== itemId && task.linkedInventoryItemId !== itemId,
        ),
      );
      setViewingItem((current) => (current?.id === itemId ? null : current));
      setApiMessage(null);
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleUpdateAmount(itemId: string, amount: number) {
    const item = items.find((currentItem) => currentItem.id === itemId);
    const now = new Date().toISOString();

    if (!item) return;

    const updatedItem = { ...item, currentAmount: amount, updatedAt: now };

    try {
      await savePreparationItem(updatedItem, false);
      setItems((current) => upsertPreparationItem(current, updatedItem));
      setApiMessage(null);
      setSuccessMessage(`${updatedItem.name} quantity was updated.`);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleSaveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTask) return;

    const { task, isNew } = prepareTaskForSave(editingTask);

    try {
      await saveTask(task, isNew);
      setDismissedAutoTaskIds((current) => current.filter((taskId) => taskId !== task.id));
      setTasks((current) => upsertTask(current, task));
      setEditingTask(null);
      setApiMessage(null);
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleCompleteTask(task: Task) {
    const completedTask = markTaskCompleted(task);
    const isNewAutoTask = task.id.startsWith("auto-");

    try {
      await saveTask(completedTask, isNewAutoTask);
      setTasks((current) => upsertTask(current, completedTask));
      setDismissedAutoTaskIds((current) => current.filter((taskId) => taskId !== task.id));
      setApiMessage(null);
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
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
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  return (
    <AppShell
      activeView={activeView}
      action={getActionButton(activeView, setEditingItem, setEditingTask)}
      pendingTaskCount={pendingTasks.length}
      subtitle={getSubtitle(
        activeView,
        items.length,
        lowStockItems.length,
        pendingTasks.length,
        generatedTasks.length,
        completedTasks.length,
      )}
      title={getTitle(activeView)}
      onViewChange={setActiveView}
    >
      {apiMessage && (
        <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-5 lg:mx-7">
          {apiMessage}
        </div>
      )}

      {isLoading && (
        <div className="mx-4 mt-4 rounded-md border border-[#dedbd3] bg-white px-4 py-3 text-sm text-[#5f5a52] md:mx-5 lg:mx-7">
          Loading database records...
        </div>
      )}

      {activeView === "preparation" && (
        <PreparationDashboard
          filters={{ search, category, lowOnly }}
          items={filteredItems}
          onCategoryChange={setCategory}
          onDelete={handleDeleteItem}
          onEdit={setEditingItem}
          onLowOnlyChange={setLowOnly}
          onSearchChange={setSearch}
          onUpdateAmount={handleUpdateAmount}
          onView={setViewingItem}
        />
      )}

      {activeView === "tasks" && (
        <TaskList
          generatedCount={generatedTasks.length}
          preparations={items}
          tasks={pendingTasks}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
          onEdit={setEditingTask}
        />
      )}

      {activeView === "completed" && (
        <CompletedTasksView
          tasks={completedTasks}
          onDelete={handleDeleteTask}
          onEdit={setEditingTask}
        />
      )}

      {editingItem && (
        <PreparationItemForm
          item={editingItem}
          onChange={setEditingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onChange={setEditingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
        />
      )}

      {viewingItem && (
        <PreparationItemDetails
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={() => {
            setEditingItem(viewingItem);
            setViewingItem(null);
          }}
        />
      )}

      {successMessage && (
        <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
    </AppShell>
  );
}

function upsertPreparationItem(items: PreparationItem[], item: PreparationItem) {
  return items.some((currentItem) => currentItem.id === item.id)
    ? items.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
    : [item, ...items];
}

function upsertTask(tasks: Task[], task: Task) {
  return tasks.some((currentTask) => currentTask.id === task.id)
    ? tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask))
    : [task, ...tasks];
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The database request failed.";
}

function getActionButton(
  view: AppView,
  setEditingItem: (item: PreparationItem) => void,
  setEditingTask: (task: Task) => void,
) {
  if (view === "preparation") {
    return (
      <Button
        className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
        onClick={() => setEditingItem(createPreparationItemDraft())}
      >
        <Plus size={18} /> <span className="hidden lg:inline">Add Preparation</span>
      </Button>
    );
  }

  if (view === "tasks") {
    return (
      <Button
        className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
        onClick={() => setEditingTask(createTaskDraft())}
      >
        <Plus size={18} /> <span className="hidden lg:inline">Add Task</span>
      </Button>
    );
  }

  return null;
}

function getTitle(view: AppView) {
  if (view === "tasks") return "Tasks";
  if (view === "completed") return "Completed Tasks";
  return "Preparation";
}

function getSubtitle(
  view: AppView,
  itemCount: number,
  lowStockCount: number,
  pendingCount: number,
  generatedTaskCount: number,
  completedCount: number,
) {
  if (view === "tasks") {
    return `${pendingCount} pending - ${generatedTaskCount} from low prep`;
  }

  if (view === "completed") {
    return `${completedCount} completed`;
  }

  return `${itemCount} preparations - ${lowStockCount} low stock`;
}
