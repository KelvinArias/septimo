import type { Task } from "@/app/tasks/types/task";

export async function fetchTasks() {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load tasks."));
  }

  return (await response.json()) as Task[];
}

export async function saveTask(task: Task, isNew: boolean) {
  const response = await fetch(isNew ? "/api/tasks" : `/api/tasks/${task.id}`, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to save task."));
  }

  return (await response.json()) as Task;
}

export async function removeTask(id: string) {
  const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to delete task."));
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
