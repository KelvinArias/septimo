import { afterEach, describe, expect, it, vi } from "vitest";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import type { Task } from "@/app/tasks/types/task";
import {
  createLowStockTask,
  createTaskDraft,
  getGeneratedLowStockTasks,
  getTaskPreparationItemId,
  markTaskCompleted,
  prepareTaskForSave,
  sortTasks,
} from "./task.utils";

const preparationItem = (overrides: Partial<PreparationItem> = {}): PreparationItem => ({
  id: "prep-1",
  name: "Ginger Syrup",
  category: "Syrup",
  currentAmount: 100,
  minimumAmount: 250,
  unit: "ml",
  ingredients: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const task = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Prep syrup",
  description: "Make syrup",
  status: "pending",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

afterEach(() => {
  vi.useRealTimers();
});

describe("sortTasks", () => {
  it("sorts tasks newest first without mutating the original list", () => {
    const olderTask = task({ id: "task-old", createdAt: "2026-01-01T00:00:00.000Z" });
    const newerTask = task({ id: "task-new", createdAt: "2026-02-01T00:00:00.000Z" });
    const tasks = [olderTask, newerTask];

    expect(sortTasks(tasks)).toEqual([newerTask, olderTask]);
    expect(tasks).toEqual([olderTask, newerTask]);
  });
});

describe("createLowStockTask", () => {
  it("creates a pending task describing the amount needed to replenish stock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    expect(createLowStockTask(preparationItem())).toEqual({
      id: "auto-prep-1",
      title: "Ginger Syrup",
      description: "Current stock is 100ml. Prepare at least 250ml to bring levels up.",
      status: "pending",
      createdAt: "2026-03-04T05:06:07.000Z",
      linkedPreparationItemId: "prep-1",
    });
  });

  it("uses the minimum amount when current stock is below zero", () => {
    const lowStockTask = createLowStockTask(
      preparationItem({ currentAmount: -25, minimumAmount: 100, unit: "g" }),
    );

    expect(lowStockTask.description).toContain("Prepare at least 125g");
  });
});

describe("getTaskPreparationItemId", () => {
  it("returns the preparation item id when present", () => {
    expect(
      getTaskPreparationItemId(
        task({ linkedPreparationItemId: "prep-1", linkedInventoryItemId: "legacy-1" }),
      ),
    ).toBe("prep-1");
  });

  it("falls back to the legacy inventory item id", () => {
    expect(getTaskPreparationItemId(task({ linkedInventoryItemId: "legacy-1" }))).toBe(
      "legacy-1",
    );
  });
});

describe("getGeneratedLowStockTasks", () => {
  it("generates tasks only for low-stock preparation items without existing tasks", () => {
    const items = [
      preparationItem({ id: "prep-1", currentAmount: 100, minimumAmount: 250 }),
      preparationItem({ id: "prep-2", currentAmount: 500, minimumAmount: 250 }),
      preparationItem({ id: "prep-3", currentAmount: 50, minimumAmount: 250 }),
    ];
    const tasks = [task({ linkedPreparationItemId: "prep-1" })];

    expect(getGeneratedLowStockTasks(items, tasks)).toEqual([
      expect.objectContaining({
        id: "auto-prep-3",
        linkedPreparationItemId: "prep-3",
      }),
    ]);
  });

  it("generates tasks for out-of-stock preparation items without duplicating existing tasks", () => {
    const items = [
      preparationItem({ id: "prep-1", currentAmount: 0, minimumAmount: 250 }),
      preparationItem({ id: "prep-2", currentAmount: -1, minimumAmount: 250 }),
    ];
    const tasks = [task({ linkedPreparationItemId: "prep-1" })];

    expect(getGeneratedLowStockTasks(items, tasks)).toEqual([
      expect.objectContaining({
        id: "auto-prep-2",
        linkedPreparationItemId: "prep-2",
      }),
    ]);
  });
});

describe("createTaskDraft", () => {
  it("creates a blank pending task draft", () => {
    expect(createTaskDraft()).toEqual({
      id: "",
      title: "",
      description: "",
      status: "pending",
      createdAt: "",
    });
  });
});

describe("prepareTaskForSave", () => {
  it("creates an id and created date for new tasks", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    const result = prepareTaskForSave(task({ id: "", title: "Prep Citrus", createdAt: "" }));

    expect(result).toEqual({
      isNew: true,
      task: expect.objectContaining({
        id: "task-prep-citrus-1772600767000",
        createdAt: "2026-03-04T05:06:07.000Z",
      }),
    });
  });

  it("preserves existing ids and created dates for existing tasks", () => {
    const result = prepareTaskForSave(
      task({ id: "task-1", createdAt: "2026-01-01T00:00:00.000Z" }),
    );

    expect(result.isNew).toBe(false);
    expect(result.task.id).toBe("task-1");
    expect(result.task.createdAt).toBe("2026-01-01T00:00:00.000Z");
  });
});

describe("markTaskCompleted", () => {
  it("marks a regular task completed and preserves its id", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    expect(markTaskCompleted(task({ id: "task-1" }))).toEqual(
      expect.objectContaining({
        id: "task-1",
        status: "completed",
        completedAt: "2026-03-04T05:06:07.000Z",
      }),
    );
  });

  it("converts auto-generated task ids before completing them", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    expect(markTaskCompleted(task({ id: "auto-prep-1" }))).toEqual(
      expect.objectContaining({
        id: "task-auto-prep-1-1772600767000",
        status: "completed",
      }),
    );
  });
});
