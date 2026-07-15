"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/app/features/navigation/app-shell";
import { RouteErrorBanner, RouteLoadingBanner } from "@/app/features/route-feedback";
import { getErrorMessage, upsertById } from "@/app/features/route-state.utils";
import { InventoryDashboard } from "@/app/inventory/features/inventory-dashboard";
import { InventoryItemDetails } from "@/app/inventory/features/inventory-item-details";
import { InventoryItemForm } from "@/app/inventory/features/inventory-item-form";
import type {
  InventoryCategory,
  InventoryItem,
} from "@/app/inventory/types/inventory";
import {
  createInventoryItemDraft,
  findDuplicateInventoryItem,
  filterInventoryItems,
  isInventoryLowStock,
  isInventoryOutOfStock,
  prepareInventoryItemForSave,
} from "@/app/inventory/utils/inventory.utils";
import {
  getGeneratedInventoryRestockTasks,
  getGeneratedLowStockTasks,
} from "@/app/tasks/utils/task.utils";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import {
  fetchInventoryItems,
  removeInventoryItem,
  saveInventoryItem,
} from "@/services/inventory-client.service";
import { fetchPreparationItems } from "@/services/preparation-client.service";
import { fetchTasks } from "@/services/task-client.service";
import type { StockStatusFilter } from "@/utils";

export function InventoryPageContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | InventoryCategory>("All");
  const [stockStatus, setStockStatus] = useState<StockStatusFilter>("All");
  const [activeOnly, setActiveOnly] = useState(true);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedItems, preparations, tasks] = await Promise.all([
          fetchInventoryItems(),
          fetchPreparationItems(),
          fetchTasks(),
        ]);

        setItems(loadedItems);
        setPendingTaskCount(
          [
            ...getGeneratedLowStockTasks(preparations, tasks, loadedItems),
            ...getGeneratedInventoryRestockTasks(loadedItems, preparations, tasks),
            ...tasks,
          ].filter((task) => task.status === "pending").length,
        );
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

  const lowItems = useMemo(() => items.filter(isInventoryLowStock), [items]);
  const outOfStockItems = useMemo(() => items.filter(isInventoryOutOfStock), [items]);
  const filteredItems = filterInventoryItems(items, {
    activeOnly,
    category,
    search,
    stockStatus,
  });

  async function handleSaveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingItem) return;

    const { item, isNew } = prepareInventoryItemForSave(editingItem);
    const duplicate = findDuplicateInventoryItem(items, item.name, isNew ? undefined : item.id);

    if (duplicate) {
      setNameError(`"${duplicate.name}" already exists in inventory.`);
      return;
    }

    try {
      const savedItem = await saveInventoryItem(item, isNew);
      setItems((current) => upsertById(current, savedItem));
      setViewingItem(isNew ? null : savedItem);
      setEditingItem(null);
      setApiMessage(null);
      setNameError(null);
      setSuccessMessage(
        isNew ? `${savedItem.name} was added to inventory.` : `${savedItem.name} was updated.`,
      );
    } catch (error) {
      const message = getErrorMessage(error);

      setApiMessage(message);
      setNameError(message);
      setSuccessMessage(null);
    }
  }

  async function handleDeleteItem(itemId: string) {
    try {
      await removeInventoryItem(itemId);
      setItems((current) => current.filter((item) => item.id !== itemId));
      setViewingItem((current) => (current?.id === itemId ? null : current));
      setApiMessage(null);
      setSuccessMessage(null);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    const item = items.find((currentItem) => currentItem.id === itemId);
    const now = new Date().toISOString();

    if (!item) return;

    const updatedItem = { ...item, currentQuantity: quantity, updatedAt: now };

    try {
      const savedItem = await saveInventoryItem(updatedItem, false);
      setItems((current) => upsertById(current, savedItem));
      setApiMessage(null);
      setSuccessMessage(`${savedItem.name} quantity was updated.`);
    } catch (error) {
      setApiMessage(getErrorMessage(error));
      setSuccessMessage(null);
    }
  }

  return (
    <AppShell
      activeView="inventory"
      action={
        <Button
          className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
          onClick={() => setEditingItem(createInventoryItemDraft())}
        >
          <Plus size={18} /> <span className="hidden lg:inline">Add Item</span>
        </Button>
      }
      pendingTaskCount={pendingTaskCount}
      subtitle={`${items.length} raw items - ${lowItems.length} low stock - ${outOfStockItems.length} out of stock`}
      title="Inventory"
    >
      {apiMessage && <RouteErrorBanner message={apiMessage} />}
      {isLoading && <RouteLoadingBanner />}

      <InventoryDashboard
        filters={{ activeOnly, category, search, stockStatus }}
        items={filteredItems}
        onActiveOnlyChange={setActiveOnly}
        onCategoryChange={setCategory}
        onDelete={handleDeleteItem}
        onEdit={setEditingItem}
        onSearchChange={setSearch}
        onStockStatusChange={setStockStatus}
        onUpdateQuantity={handleUpdateQuantity}
        onView={setViewingItem}
      />

      {editingItem && (
        <InventoryItemForm
          item={editingItem}
          nameError={nameError ?? undefined}
          onChange={(item) => {
            setEditingItem(item);
            setNameError(null);
          }}
          onClose={() => {
            setEditingItem(null);
            setNameError(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {viewingItem && (
        <InventoryItemDetails
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
