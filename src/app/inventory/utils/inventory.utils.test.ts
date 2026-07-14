import { afterEach, describe, expect, it, vi } from "vitest";
import type { InventoryItem } from "@/app/inventory/types/inventory";
import {
  createInventoryItemDraft,
  filterInventoryItems,
  findDuplicateInventoryItem,
  getInventoryStockStatus,
  isInventoryLowStock,
  isInventoryOutOfStock,
  normalizeInventoryName,
  prepareInventoryItemForSave,
  searchInventoryItems,
} from "./inventory.utils";

const inventoryItem = (overrides: Partial<InventoryItem> = {}): InventoryItem => ({
  id: "inv-1",
  name: "Lime",
  category: "Fruit",
  currentQuantity: 10,
  minimumQuantity: 5,
  unit: "units",
  dateAdded: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  expirationDate: "",
  supplier: "Farm Co",
  storageLocation: "Walk-in",
  notes: "For garnish",
  parLevel: 20,
  costPerUnit: 0.5,
  sku: "LIME-001",
  active: true,
  ...overrides,
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getInventoryStockStatus", () => {
  it("derives available, low-stock, and out-of-stock statuses from quantity", () => {
    expect(getInventoryStockStatus(inventoryItem({ currentQuantity: 6, minimumQuantity: 5 }))).toBe(
      "available",
    );
    expect(getInventoryStockStatus(inventoryItem({ currentQuantity: 5, minimumQuantity: 5 }))).toBe(
      "low-stock",
    );
    expect(getInventoryStockStatus(inventoryItem({ currentQuantity: 0, minimumQuantity: 5 }))).toBe(
      "out-of-stock",
    );
  });
});

describe("isInventoryLowStock", () => {
  it("returns true when current quantity is at or below the minimum", () => {
    expect(isInventoryLowStock(inventoryItem({ currentQuantity: 5, minimumQuantity: 5 }))).toBe(
      true,
    );
    expect(isInventoryLowStock(inventoryItem({ currentQuantity: 4, minimumQuantity: 5 }))).toBe(
      true,
    );
  });

  it("returns false when current quantity is above the minimum", () => {
    expect(isInventoryLowStock(inventoryItem({ currentQuantity: 6, minimumQuantity: 5 }))).toBe(
      false,
    );
  });

  it("returns false when there is no minimum quantity set", () => {
    expect(isInventoryLowStock(inventoryItem({ currentQuantity: 0, minimumQuantity: 0 }))).toBe(
      false,
    );
  });

  it("returns false for out-of-stock items", () => {
    expect(isInventoryLowStock(inventoryItem({ currentQuantity: 0, minimumQuantity: 5 }))).toBe(
      false,
    );
  });
});

describe("isInventoryOutOfStock", () => {
  it("returns true when current quantity is zero or below", () => {
    expect(isInventoryOutOfStock(inventoryItem({ currentQuantity: 0, minimumQuantity: 5 }))).toBe(
      true,
    );
    expect(isInventoryOutOfStock(inventoryItem({ currentQuantity: -1, minimumQuantity: 5 }))).toBe(
      true,
    );
  });
});

describe("normalizeInventoryName", () => {
  it("trims, collapses spaces, and lowercases names", () => {
    expect(normalizeInventoryName("  Fresh   Lime  Juice ")).toBe("fresh lime juice");
  });
});

describe("findDuplicateInventoryItem", () => {
  it("finds an existing item with the same normalized name", () => {
    const duplicate = inventoryItem({ id: "inv-2", name: "fresh lime juice" });
    const items = [inventoryItem(), duplicate];

    expect(findDuplicateInventoryItem(items, " Fresh   Lime Juice ")).toBe(duplicate);
  });

  it("ignores the current item and empty names", () => {
    const items = [inventoryItem({ id: "inv-1", name: "Lime" })];

    expect(findDuplicateInventoryItem(items, "lime", "inv-1")).toBeUndefined();
    expect(findDuplicateInventoryItem(items, "   ")).toBeUndefined();
  });
});

describe("searchInventoryItems", () => {
  it("returns the original list for blank searches", () => {
    const items = [inventoryItem()];

    expect(searchInventoryItems(items, "   ")).toBe(items);
  });

  it("matches common searchable item fields case-insensitively", () => {
    const items = [
      inventoryItem({ id: "inv-1", name: "Lime", supplier: "Farm Co" }),
      inventoryItem({
        id: "inv-2",
        name: "Simple Syrup",
        category: "Bottle",
        sku: "SYRUP-1",
        supplier: "Bar Goods",
      }),
    ];

    expect(searchInventoryItems(items, "syrup")).toEqual([items[1]]);
    expect(searchInventoryItems(items, "farm co")).toEqual([items[0]]);
  });
});

describe("filterInventoryItems", () => {
  it("filters by search, category, low stock, and active status", () => {
    const matchingItem = inventoryItem({
      id: "inv-1",
      name: "Lime",
      category: "Fruit",
      currentQuantity: 2,
      minimumQuantity: 5,
      active: true,
    });
    const inactiveLowStockItem = inventoryItem({
      id: "inv-2",
      name: "Lime Wheel",
      currentQuantity: 1,
      minimumQuantity: 5,
      active: false,
    });
    const wrongCategoryItem = inventoryItem({
      id: "inv-3",
      name: "Lime Cordial",
      category: "Bottle",
      currentQuantity: 1,
      minimumQuantity: 5,
    });

    expect(
      filterInventoryItems([matchingItem, inactiveLowStockItem, wrongCategoryItem], {
        search: "lime",
        category: "Fruit",
        stockStatus: "low-stock",
        activeOnly: true,
      }),
    ).toEqual([matchingItem]);
  });

  it("filters out-of-stock items separately from low-stock items", () => {
    const outOfStockItem = inventoryItem({
      id: "inv-1",
      currentQuantity: 0,
      minimumQuantity: 5,
    });
    const lowStockItem = inventoryItem({
      id: "inv-2",
      currentQuantity: 1,
      minimumQuantity: 5,
    });

    expect(
      filterInventoryItems([outOfStockItem, lowStockItem], {
        search: "",
        category: "All",
        stockStatus: "out-of-stock",
        activeOnly: true,
      }),
    ).toEqual([outOfStockItem]);
  });
});

describe("createInventoryItemDraft", () => {
  it("creates a blank active fruit inventory item draft", () => {
    expect(createInventoryItemDraft()).toMatchObject({
      id: "",
      name: "",
      category: "Fruit",
      currentQuantity: 0,
      minimumQuantity: 0,
      unit: "units",
      active: true,
    });
  });
});

describe("prepareInventoryItemForSave", () => {
  it("creates an id and timestamps for new items", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    const result = prepareInventoryItemForSave(
      inventoryItem({ id: "", name: " Fresh Lime ", dateAdded: "", updatedAt: "" }),
    );

    expect(result).toEqual({
      isNew: true,
      item: expect.objectContaining({
        id: "raw-fresh-lime-1772600767000",
        name: "Fresh Lime",
        dateAdded: "2026-03-04T05:06:07.000Z",
        updatedAt: "2026-03-04T05:06:07.000Z",
      }),
    });
  });

  it("preserves existing ids and date added values for existing items", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T05:06:07.000Z"));

    const result = prepareInventoryItemForSave(
      inventoryItem({
        id: "inv-1",
        name: " Lime ",
        dateAdded: "2026-01-01T00:00:00.000Z",
      }),
    );

    expect(result.isNew).toBe(false);
    expect(result.item.id).toBe("inv-1");
    expect(result.item.dateAdded).toBe("2026-01-01T00:00:00.000Z");
    expect(result.item.updatedAt).toBe("2026-03-04T05:06:07.000Z");
  });
});
