"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/app/features/navigation/app-shell";
import { RouteErrorBanner, RouteLoadingBanner } from "@/app/features/route-feedback";
import { getErrorMessage, upsertById } from "@/app/features/route-state.utils";
import type {
  InventoryCategory,
  InventoryItem,
} from "@/app/inventory/types/inventory";
import {
  createInventoryItemDraft,
  findDuplicateInventoryItem,
  prepareInventoryItemForSave,
} from "@/app/inventory/utils/inventory.utils";
import { PreparationDashboard } from "@/app/preparation/features/preparation-dashboard";
import { PreparationItemDetails } from "@/app/preparation/features/preparation-item-details";
import { PreparationItemForm } from "@/app/preparation/features/preparation-item-form";
import type {
  PreparationCategory,
  PreparationItem,
} from "@/app/preparation/types/preparation";
import {
  createPreparationItemDraft,
  filterPreparationItems,
  isCannotProduce,
  isLowStock,
  isOutOfStock,
  preparePreparationItemForSave,
  type ProductionStatusFilter,
} from "@/app/preparation/utils/preparation.utils";
import {
  getGeneratedInventoryRestockTasks,
  getGeneratedLowStockTasks,
} from "@/app/tasks/utils/task.utils";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import {
  fetchInventoryItems,
  saveInventoryItem,
} from "@/services/inventory-client.service";
import {
  fetchPreparationItems,
  removePreparationItem,
  savePreparationItem,
} from "@/services/preparation-client.service";
import { fetchTasks } from "@/services/task-client.service";
import type { Unit } from "@/types";
import type { StockStatusFilter } from "@/utils";

export function PreparationPageContent() {
  const [items, setItems] = useState<PreparationItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | PreparationCategory>("All");
  const [stockStatus, setStockStatus] = useState<StockStatusFilter>("All");
  const [productionStatus, setProductionStatus] = useState<ProductionStatusFilter>("All");
  const [editingItem, setEditingItem] = useState<PreparationItem | null>(null);
  const [viewingItem, setViewingItem] = useState<PreparationItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedItems, loadedInventoryItems, tasks] = await Promise.all([
          fetchPreparationItems(),
          fetchInventoryItems(),
          fetchTasks(),
        ]);

        setItems(loadedItems);
        setInventoryItems(loadedInventoryItems);
        setPendingTaskCount(
          [
            ...getGeneratedLowStockTasks(loadedItems, tasks, loadedInventoryItems),
            ...getGeneratedInventoryRestockTasks(loadedInventoryItems, loadedItems, tasks),
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

  const lowItems = useMemo(() => items.filter(isLowStock), [items]);
  const outOfStockItems = useMemo(() => items.filter(isOutOfStock), [items]);
  const cannotProduceItems = useMemo(
    () => items.filter((item) => isCannotProduce(item, inventoryItems)),
    [inventoryItems, items],
  );
  const filteredItems = filterPreparationItems(
    items,
    { category, productionStatus, search, stockStatus },
    inventoryItems,
  );

  async function handleQuickCreateInventoryItem(
    name: string,
    itemCategory: InventoryCategory,
    unit: Unit,
  ) {
    const draft = createInventoryItemDraft();
    const { item } = prepareInventoryItemForSave({
      ...draft,
      name,
      category: itemCategory,
      unit,
    });
    const duplicate = findDuplicateInventoryItem(inventoryItems, item.name);

    if (duplicate) {
      throw new Error(`"${duplicate.name}" already exists in inventory.`);
    }

    const savedItem = await saveInventoryItem(item, true);

    setInventoryItems((current) => upsertById(current, savedItem));
    setApiMessage(null);
    setSuccessMessage(`${savedItem.name} was added to inventory.`);

    return savedItem;
  }

  async function handleSaveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingItem) return;

    const { item, isNew } = preparePreparationItemForSave(editingItem);

    try {
      const savedItem = await savePreparationItem(item, isNew);
      setItems((current) => upsertById(current, savedItem));
      setViewingItem(isNew ? null : savedItem);
      setEditingItem(null);
      setApiMessage(null);
      setSuccessMessage(
        isNew ? `${savedItem.name} was added to preparation.` : `${savedItem.name} was updated.`,
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
      const savedItem = await savePreparationItem(updatedItem, false);
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
      activeView="preparation"
      action={
        <Button
          className="h-12 w-12 rounded-full p-0 shadow-lg lg:h-9 lg:w-auto lg:rounded-md lg:px-4 lg:shadow-none"
          onClick={() => setEditingItem(createPreparationItemDraft())}
        >
          <Plus size={18} /> <span className="hidden lg:inline">Add Preparation</span>
        </Button>
      }
      pendingTaskCount={pendingTaskCount}
      subtitle={`${items.length} preparations - ${lowItems.length} low stock - ${outOfStockItems.length} out of stock - ${cannotProduceItems.length} cannot produce`}
      title="Preparation"
    >
      {apiMessage && <RouteErrorBanner message={apiMessage} />}
      {isLoading && <RouteLoadingBanner />}

      <PreparationDashboard
        filters={{ category, productionStatus, search, stockStatus }}
        inventoryItems={inventoryItems}
        items={filteredItems}
        onCategoryChange={setCategory}
        onDelete={handleDeleteItem}
        onEdit={setEditingItem}
        onProductionStatusChange={setProductionStatus}
        onSearchChange={setSearch}
        onStockStatusChange={setStockStatus}
        onUpdateAmount={handleUpdateAmount}
        onView={setViewingItem}
      />

      {editingItem && (
        <PreparationItemForm
          item={editingItem}
          inventoryItems={inventoryItems}
          onChange={setEditingItem}
          onClose={() => setEditingItem(null)}
          onQuickCreateInventoryItem={handleQuickCreateInventoryItem}
          onSave={handleSaveItem}
        />
      )}

      {viewingItem && (
        <PreparationItemDetails
          inventoryItems={inventoryItems}
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
