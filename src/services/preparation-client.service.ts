import type { PreparationItem } from "@/app/preparation/types/preparation";

export async function fetchPreparationItems() {
  const response = await fetch("/api/preparations");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load preparations."));
  }

  return (await response.json()) as PreparationItem[];
}

export async function savePreparationItem(item: PreparationItem, isNew: boolean) {
  const response = await fetch(isNew ? "/api/preparations" : `/api/preparations/${item.id}`, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to save preparation item."));
  }

  return (await response.json()) as PreparationItem;
}

export async function removePreparationItem(id: string) {
  const response = await fetch(`/api/preparations/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to delete preparation item."));
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
