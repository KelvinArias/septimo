import type { InventoryItem } from "@/app/inventory/types/inventory";

export async function fetchInventoryItems() {
  const response = await fetch("/api/inventory");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load inventory."));
  }

  return (await response.json()) as InventoryItem[];
}

export async function saveInventoryItem(item: InventoryItem, isNew: boolean) {
  const response = await fetch(isNew ? "/api/inventory" : `/api/inventory/${item.id}`, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to save inventory item."));
  }

  return (await response.json()) as InventoryItem;
}

export async function removeInventoryItem(id: string) {
  const response = await fetch(`/api/inventory/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to delete inventory item."));
  }
}

async function getApiErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const body = (await response.json()) as { error?: string };

    return body.error ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}
