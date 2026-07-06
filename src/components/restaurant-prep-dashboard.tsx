"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { InventoryDashboard } from "./inventory/inventory-dashboard";
import { InventoryItemDetails } from "./inventory/inventory-item-details";
import { InventoryItemForm } from "./inventory/inventory-item-form";
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
  createInventoryItemDraft,
  createPreparationItemDraft,
  createTaskDraft,
  findDuplicateInventoryItem,
  filterInventoryItems,
  filterPreparationItems,
  getGeneratedLowStockTasks,
  isInventoryLowStock,
  isLowStock,
  markTaskCompleted,
  prepareInventoryItemForSave,
  preparePreparationItemForSave,
  prepareTaskForSave,
} from "@/lib/utils";
import {
  fetchInventoryItems,
  removeInventoryItem,
  saveInventoryItem,
} from "@/services/inventory-client.service";
import {
  fetchPreparationItems,
  removePreparationItem,
  savePreparationItem,
} from "@/services/preparation-client.service";
import { fetchTasks, removeTask, saveTask } from "@/services/task-client.service";
import type {
  AppView,
  InventoryCategory,
  InventoryItem,
  PreparationCategory,
  PreparationItem,
  Task,
  Unit,
} from "@/types";

export function RestaurantPrepDashboard() {
  const [activeView, setActiveView] = useState<AppView>("inventory");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [preparationItems, setPreparationItems] = useState<PreparationItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [inventoryNameError, setInventoryNameError] = useState<string | null>(null);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState<"All" | InventoryCategory>("All");
  const [inventoryLowOnly, setInventoryLowOnly] = useState(false);
  const [inventoryActiveOnly, setInventoryActiveOnly] = useState(true);
  const [preparationSearch, setPreparationSearch] = useState("");
  const [preparationCategory, setPreparationCategory] = useState<"All" | PreparationCategory>(
    "All",
  );
  const [preparationLowOnly, setPreparationLowOnly] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
  const [viewingInventoryItem, setViewingInventoryItem] = useState<InventoryItem | null>(null);
  const [editingPreparationItem, setEditingPreparationItem] = useState<PreparationItem | null>(
    null,
  );
  const [viewingPreparationItem, setViewingPreparationItem] = useState<PreparationItem | null>(
    null,
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dismissedAutoTaskIds, setDismissedAutoTaskIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedInventoryItems, loadedPreparationItems, loadedTasks] = await Promise.all([
          fetchInventoryItems(),
          fetchPreparationItems(),
          fetchTasks(),
        ]);

        setInventoryItems(loadedInventoryItems);
        setPreparationItems(loadedPreparationItems);
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

  const lowInventoryItems = useMemo(
    () => inventoryItems.filter(isInventoryLowStock),
    [inventoryItems],
  );
  const lowPreparationItems = useMemo(
    () => preparationItems.filter(isLowStock),
    [preparationItems],
  );
  const generatedTasks = useMemo(
    () =>
      getGeneratedLowStockTasks(preparationItems, tasks).filter(
        (task) => !dismissedAutoTaskIds.includes(task.id),
      ),
    [dismissedAutoTaskIds, preparationItems, tasks],
  );
  const allTasks = useMemo(() => [...generatedTasks, ...tasks], [generatedTasks, tasks]);
  const pendingTasks = allTasks.filter((task) => task.status === "pending");
  const completedTasks = allTasks.filter((task) => task.status === "completed");
  const filteredInventoryItems = filterInventoryItems(inventoryItems, {
    activeOnly: inventoryActiveOnly,
    category: inventoryCategory,
    lowOnly: inventoryLowOnly,
    search: inventorySearch,
  });
  const filteredPreparationItems = filterPreparationItems(preparationItems, {
    category: preparationCategory,
    lowOnly: preparationLowOnly,
    search: preparationSearch,
  });

  async function handleSaveInventoryItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingInventoryItem) return;

    const { item, isNew } = prepareInventoryItemForSave(editingInventoryItem);
    const duplicate = findDuplicateInventoryItem(
      inventoryItems,
      item.name,
      isNew ? undefined : item.id,
    );

    if (duplicate) {
      setInventoryNameError(`"${duplicate.name}" already exists in inventory.`);
      return;
    }

    try {
      await saveInventoryItem(item, isNew);
      setInventoryItems((current) => upsertInventoryItem(current, item));
      setViewingInventoryItem(isNew ? null : item);
      setEditingInventoryItem(null);
      setApiMessage(null);
      setInventoryNameError(null);
      setSuccessMessage(
        isNew ? `${item.name} was added to inventory.` : `${item.name} was updated.`,
      );
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setInventoryNameError(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleQuickCreateInventoryItem(
    name: string,
    category: InventoryCategory,
    unit: Unit,
  ) {
    const draft = createInventoryItemDraft();
    const { item } = prepareInventoryItemForSave({
      ...draft,
      name,
      category,
      unit,
    });
    const duplicate = findDuplicateInventoryItem(inventoryItems, item.name);

    if (duplicate) {
      throw new Error(`"${duplicate.name}" already exists in inventory.`);
    }

    const savedItem = await saveInventoryItem(item, true);

    setInventoryItems((current) => upsertInventoryItem(current, savedItem));
    setApiMessage(null);
    setInventoryNameError(null);
    setSuccessMessage(`${savedItem.name} was added to inventory.`);

    return savedItem;
  }

  async function handleDeleteInventoryItem(itemId: string) {
    try {
      await removeInventoryItem(itemId);
      setInventoryItems((current) => current.filter((item) => item.id !== itemId));
      setViewingInventoryItem((current) => (current?.id === itemId ? null : current));
      setApiMessage(null);
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleUpdateInventoryQuantity(itemId: string, quantity: number) {
    const item = inventoryItems.find((currentItem) => currentItem.id === itemId);
    const now = new Date().toISOString();

    if (!item) return;

    const updatedItem = { ...item, currentQuantity: quantity, updatedAt: now };

    try {
      await saveInventoryItem(updatedItem, false);
      setInventoryItems((current) => upsertInventoryItem(current, updatedItem));
      setApiMessage(null);
      setSuccessMessage(`${updatedItem.name} quantity was updated.`);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleSavePreparationItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingPreparationItem) return;

    const { item, isNew } = preparePreparationItemForSave(editingPreparationItem);

    try {
      await savePreparationItem(item, isNew);
      setPreparationItems((current) => upsertPreparationItem(current, item));
      setViewingPreparationItem(isNew ? null : item);
      setEditingPreparationItem(null);
      setApiMessage(null);
      setSuccessMessage(
        isNew ? `${item.name} was added to preparation.` : `${item.name} was updated.`,
      );
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleDeletePreparationItem(itemId: string) {
    try {
      await removePreparationItem(itemId);
      setPreparationItems((current) => current.filter((item) => item.id !== itemId));
      setTasks((current) =>
        current.filter(
          (task) =>
            task.linkedPreparationItemId !== itemId && task.linkedInventoryItemId !== itemId,
        ),
      );
      setViewingPreparationItem((current) => (current?.id === itemId ? null : current));
      setApiMessage(null);
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleUpdatePreparationAmount(itemId: string, amount: number) {
    const item = preparationItems.find((currentItem) => currentItem.id === itemId);
    const now = new Date().toISOString();

    if (!item) return;

    const updatedItem = { ...item, currentAmount: amount, updatedAt: now };

    try {
      await savePreparationItem(updatedItem, false);
      setPreparationItems((current) => upsertPreparationItem(current, updatedItem));
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
      action={getActionButton(
        activeView,
        setEditingInventoryItem,
        setEditingPreparationItem,
        setEditingTask,
      )}
      pendingTaskCount={pendingTasks.length}
      subtitle={getSubtitle(
        activeView,
        inventoryItems.length,
        lowInventoryItems.length,
        preparationItems.length,
        lowPreparationItems.length,
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

      {activeView === "inventory" && (
        <InventoryDashboard
          filters={{
            activeOnly: inventoryActiveOnly,
            category: inventoryCategory,
            lowOnly: inventoryLowOnly,
            search: inventorySearch,
          }}
          items={filteredInventoryItems}
          onActiveOnlyChange={setInventoryActiveOnly}
          onCategoryChange={setInventoryCategory}
          onDelete={handleDeleteInventoryItem}
          onEdit={setEditingInventoryItem}
          onLowOnlyChange={setInventoryLowOnly}
          onSearchChange={setInventorySearch}
          onUpdateQuantity={handleUpdateInventoryQuantity}
          onView={setViewingInventoryItem}
        />
      )}

      {activeView === "preparation" && (
        <PreparationDashboard
          filters={{
            category: preparationCategory,
            lowOnly: preparationLowOnly,
            search: preparationSearch,
          }}
          items={filteredPreparationItems}
          onCategoryChange={setPreparationCategory}
          onDelete={handleDeletePreparationItem}
          onEdit={setEditingPreparationItem}
          onLowOnlyChange={setPreparationLowOnly}
          onSearchChange={setPreparationSearch}
          onUpdateAmount={handleUpdatePreparationAmount}
          onView={setViewingPreparationItem}
        />
      )}

      {activeView === "tasks" && (
        <TaskList
          generatedCount={generatedTasks.length}
          preparations={preparationItems}
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

      {editingInventoryItem && (
        <InventoryItemForm
          item={editingInventoryItem}
          nameError={inventoryNameError ?? undefined}
          onChange={(item) => {
            setEditingInventoryItem(item);
            setInventoryNameError(null);
          }}
          onClose={() => {
            setEditingInventoryItem(null);
            setInventoryNameError(null);
          }}
          onSave={handleSaveInventoryItem}
        />
      )}

      {editingPreparationItem && (
        <PreparationItemForm
          item={editingPreparationItem}
          inventoryItems={inventoryItems}
          onChange={setEditingPreparationItem}
          onClose={() => setEditingPreparationItem(null)}
          onQuickCreateInventoryItem={handleQuickCreateInventoryItem}
          onSave={handleSavePreparationItem}
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

      {viewingInventoryItem && (
        <InventoryItemDetails
          item={viewingInventoryItem}
          onClose={() => setViewingInventoryItem(null)}
          onEdit={() => {
            setEditingInventoryItem(viewingInventoryItem);
            setViewingInventoryItem(null);
          }}
        />
      )}

      {viewingPreparationItem && (
        <PreparationItemDetails
          item={viewingPreparationItem}
          onClose={() => setViewingPreparationItem(null)}
          onEdit={() => {
            setEditingPreparationItem(viewingPreparationItem);
            setViewingPreparationItem(null);
          }}
        />
      )}

      {successMessage && (
        <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
    </AppShell>
  );
}

function upsertInventoryItem(items: InventoryItem[], item: InventoryItem) {
  return items.some((currentItem) => currentItem.id === item.id)
    ? items.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
    : [item, ...items];
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
  setEditingInventoryItem: (item: InventoryItem) => void,
  setEditingPreparationItem: (item: PreparationItem) => void,
  setEditingTask: (task: Task) => void,
) {
  if (view === "inventory") {
    return (
      <Button
        className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
        onClick={() => setEditingInventoryItem(createInventoryItemDraft())}
      >
        <Plus size={18} /> <span className="hidden lg:inline">Add Item</span>
      </Button>
    );
  }

  if (view === "preparation") {
    return (
      <Button
        className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
        onClick={() => setEditingPreparationItem(createPreparationItemDraft())}
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
  if (view === "inventory") return "Inventory";
  if (view === "tasks") return "Tasks";
  if (view === "completed") return "Completed Tasks";
  return "Preparation";
}

function getSubtitle(
  view: AppView,
  inventoryCount: number,
  lowInventoryCount: number,
  preparationCount: number,
  lowPreparationCount: number,
  pendingCount: number,
  generatedTaskCount: number,
  completedCount: number,
) {
  if (view === "inventory") {
    return `${inventoryCount} raw items - ${lowInventoryCount} low stock`;
  }

  if (view === "tasks") {
    return `${pendingCount} pending - ${generatedTaskCount} from low prep`;
  }

  if (view === "completed") {
    return `${completedCount} completed`;
  }

  return `${preparationCount} preparations - ${lowPreparationCount} low stock`;
}
