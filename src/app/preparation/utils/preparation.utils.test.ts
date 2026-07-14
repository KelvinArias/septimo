import { afterEach, describe, expect, it, vi } from "vitest";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import {
  createPreparationItemDraft,
  filterPreparationItems,
  getPreparationStockStatus,
  isLowStock,
  isOutOfStock,
  preparePreparationItemForSave,
  searchPreparationItems,
} from "./preparation.utils";

const preparationItem = (overrides: Partial<PreparationItem> = {}): PreparationItem => ({
  id: "prep-1",
  name: "Ginger Syrup",
  category: "Syrup",
  currentAmount: 500,
  minimumAmount: 250,
  unit: "ml",
  ingredients: [{ name: "Ginger", amount: 100, unit: "g", inventoryItemId: "inv-1" }],
  notes: "House syrup",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getPreparationStockStatus", () => {
  it("derives available, low-stock, and out-of-stock statuses from amount", () => {
    expect(getPreparationStockStatus(preparationItem({ currentAmount: 251, minimumAmount: 250 }))).toBe(
      "available",
    );
    expect(getPreparationStockStatus(preparationItem({ currentAmount: 250, minimumAmount: 250 }))).toBe(
      "low-stock",
    );
    expect(getPreparationStockStatus(preparationItem({ currentAmount: 0, minimumAmount: 250 }))).toBe(
      "out-of-stock",
    );
  });
});

describe("isLowStock", () => {
  it("returns true when the current amount is at or below the minimum", () => {
    expect(isLowStock(preparationItem({ currentAmount: 250, minimumAmount: 250 }))).toBe(true);
    expect(isLowStock(preparationItem({ currentAmount: 100, minimumAmount: 250 }))).toBe(true);
  });

  it("returns false when the current amount is above the minimum", () => {
    expect(isLowStock(preparationItem({ currentAmount: 251, minimumAmount: 250 }))).toBe(false);
  });

  it("returns false for out-of-stock items", () => {
    expect(isLowStock(preparationItem({ currentAmount: 0, minimumAmount: 250 }))).toBe(false);
  });
});

describe("isOutOfStock", () => {
  it("returns true when current amount is zero or below", () => {
    expect(isOutOfStock(preparationItem({ currentAmount: 0, minimumAmount: 250 }))).toBe(true);
    expect(isOutOfStock(preparationItem({ currentAmount: -1, minimumAmount: 250 }))).toBe(true);
  });
});

describe("searchPreparationItems", () => {
  it("returns the original list for blank searches", () => {
    const items = [preparationItem()];

    expect(searchPreparationItems(items, " ")).toBe(items);
  });

  it("matches name, category, and notes case-insensitively", () => {
    const items = [
      preparationItem({ id: "prep-1", name: "Ginger Syrup", notes: "Spicy" }),
      preparationItem({ id: "prep-2", name: "Coffee Cordial", category: "Cordial" }),
    ];

    expect(searchPreparationItems(items, "cordial")).toEqual([items[1]]);
    expect(searchPreparationItems(items, "SPICY")).toEqual([items[0]]);
  });
});

describe("filterPreparationItems", () => {
  it("filters by search, category, and low stock status", () => {
    const matchingItem = preparationItem({
      id: "prep-1",
      name: "Ginger Syrup",
      category: "Syrup",
      currentAmount: 100,
      minimumAmount: 250,
    });
    const enoughStockItem = preparationItem({
      id: "prep-2",
      name: "Ginger Syrup Backup",
      currentAmount: 500,
      minimumAmount: 250,
    });
    const wrongCategoryItem = preparationItem({
      id: "prep-3",
      name: "Ginger Cordial",
      category: "Cordial",
      currentAmount: 100,
      minimumAmount: 250,
    });

    expect(
      filterPreparationItems([matchingItem, enoughStockItem, wrongCategoryItem], {
        search: "ginger",
        category: "Syrup",
        stockStatus: "low-stock",
      }),
    ).toEqual([matchingItem]);
  });

  it("filters out-of-stock items separately from low-stock items", () => {
    const outOfStockItem = preparationItem({
      id: "prep-1",
      currentAmount: 0,
      minimumAmount: 250,
    });
    const lowStockItem = preparationItem({
      id: "prep-2",
      currentAmount: 1,
      minimumAmount: 250,
    });

    expect(
      filterPreparationItems([outOfStockItem, lowStockItem], {
        search: "",
        category: "All",
        stockStatus: "out-of-stock",
      }),
    ).toEqual([outOfStockItem]);
  });
});

describe("createPreparationItemDraft", () => {
  it("creates a blank syrup preparation draft with one empty ingredient", () => {
    expect(createPreparationItemDraft()).toEqual({
      id: "",
      name: "",
      category: "Syrup",
      currentAmount: 0,
      minimumAmount: 0,
      unit: "ml",
      ingredients: [{ name: "", amount: 0, unit: "g" }],
      notes: "",
      createdAt: "",
      updatedAt: "",
    });
  });
});

describe("preparePreparationItemForSave", () => {
  it("creates an id, timestamps, and removes blank ingredients for new items", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    const result = preparePreparationItemForSave(
      preparationItem({
        id: "",
        name: "Ginger Syrup",
        createdAt: "",
        updatedAt: "",
        ingredients: [
          { name: "Ginger", amount: 100, unit: "g" },
          { name: " ", amount: 50, unit: "g" },
          { name: "Sugar", amount: 0, unit: "g" },
        ],
      }),
    );

    expect(result).toEqual({
      isNew: true,
      item: expect.objectContaining({
        id: "prep-ginger-syrup-1772600767000",
        ingredients: [{ name: "Ginger", amount: 100, unit: "g" }],
        createdAt: "2026-03-04T05:06:07.000Z",
        updatedAt: "2026-03-04T05:06:07.000Z",
      }),
    });
  });

  it("preserves existing ids and created dates for existing items", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    const result = preparePreparationItemForSave(
      preparationItem({
        id: "prep-1",
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    );

    expect(result.isNew).toBe(false);
    expect(result.item.id).toBe("prep-1");
    expect(result.item.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(result.item.updatedAt).toBe("2026-03-04T05:06:07.000Z");
  });
});
