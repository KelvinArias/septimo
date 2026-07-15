import { afterEach, describe, expect, it, vi } from "vitest";
import type { InventoryItem } from "@/app/inventory/types/inventory";
import type { PreparationItem } from "@/app/preparation/types/preparation";
import {
  createPreparationItemDraft,
  canProduce,
  cannotProduce,
  filterPreparationItems,
  getMissingIngredientNames,
  getMissingIngredientDetails,
  getPreparationStockStatus,
  getProductionStatus,
  isCannotProduce,
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

const inventoryItem = (overrides: Partial<InventoryItem> = {}): InventoryItem => ({
  id: "inv-1",
  name: "Ginger",
  category: "Herb",
  currentQuantity: 10,
  minimumQuantity: 5,
  unit: "g",
  dateAdded: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  active: true,
  ...overrides,
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getPreparationStockStatus", () => {
  it("derives available, low-stock, and out-of-stock statuses from amount", () => {
    expect(getPreparationStockStatus(preparationItem({ currentAmount: 300, minimumAmount: 250 }))).toBe(
      "available",
    );
    expect(getPreparationStockStatus(preparationItem({ currentAmount: 299, minimumAmount: 250 }))).toBe(
      "low-stock",
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
    expect(isLowStock(preparationItem({ currentAmount: 300, minimumAmount: 250 }))).toBe(false);
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

describe("getProductionStatus", () => {
  it("returns can-produce when every linked inventory item is available", () => {
    const item = preparationItem({ category: "Pre-Batch" });
    const inventory = [inventoryItem({ id: "inv-1", currentQuantity: 1 })];

    expect(getProductionStatus(item, inventory)).toBe("can-produce");
    expect(canProduce(item, inventory)).toBe(true);
  });

  it("returns cannot-produce and names one out-of-stock ingredient", () => {
    const item = preparationItem({ category: "Pre-Batch" });
    const inventory = [inventoryItem({ id: "inv-1", name: "Lime Juice", currentQuantity: 0 })];

    expect(getProductionStatus(item, inventory)).toBe("cannot-produce");
    expect(cannotProduce(item, inventory)).toBe(true);
    expect(getMissingIngredientNames(item, inventory)).toEqual(["Lime Juice"]);
    expect(getMissingIngredientDetails(item, inventory)).toEqual([
      { amount: 100, name: "Lime Juice", unit: "g" },
    ]);
  });

  it("returns every missing ingredient name for multiple shortages", () => {
    const item = preparationItem({
      category: "Pre-Batch",
      ingredients: [
        { name: "Lime", amount: 100, unit: "ml", inventoryItemId: "inv-1" },
        { name: "Mint", amount: 10, unit: "g", inventoryItemId: "inv-2" },
      ],
    });
    const inventory = [
      inventoryItem({ id: "inv-1", name: "Lime Juice", currentQuantity: 0 }),
      inventoryItem({ id: "inv-2", name: "Mint", currentQuantity: -1 }),
    ];

    expect(getMissingIngredientNames(item, inventory)).toEqual(["Lime Juice", "Mint"]);
    expect(getMissingIngredientDetails(item, inventory)).toEqual([
      { amount: 100, name: "Lime Juice", unit: "ml" },
      { amount: 10, name: "Mint", unit: "g" },
    ]);
  });

  it("treats unresolved inventory references as unavailable without crashing", () => {
    const item = preparationItem({
      category: "Pre-Batch",
      ingredients: [
        { name: "Deleted Lime", amount: 100, unit: "ml", inventoryItemId: "missing" },
      ],
    });

    expect(getProductionStatus(item, [])).toBe("cannot-produce");
    expect(getMissingIngredientNames(item, [])).toEqual(["Deleted Lime"]);
  });

  it("returns to can-produce when the last missing ingredient is restocked", () => {
    const item = preparationItem({ category: "Pre-Batch" });

    expect(getProductionStatus(item, [inventoryItem({ currentQuantity: 0 })])).toBe(
      "cannot-produce",
    );
    expect(getProductionStatus(item, [inventoryItem({ currentQuantity: 2 })])).toBe(
      "can-produce",
    );
  });

  it("keeps quantity status independent from production status", () => {
    const lowButUnproducible = preparationItem({
      category: "Pre-Batch",
      currentAmount: 2,
      minimumAmount: 5,
    });
    const emptyButProducible = preparationItem({
      category: "Pre-Batch",
      currentAmount: 0,
      minimumAmount: 5,
    });

    expect(getPreparationStockStatus(lowButUnproducible)).toBe("low-stock");
    expect(getProductionStatus(lowButUnproducible, [inventoryItem({ currentQuantity: 0 })])).toBe(
      "cannot-produce",
    );
    expect(getPreparationStockStatus(emptyButProducible)).toBe("out-of-stock");
    expect(getProductionStatus(emptyButProducible, [inventoryItem({ currentQuantity: 5 })])).toBe(
      "can-produce",
    );
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
        productionStatus: "All",
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
        productionStatus: "All",
      }),
    ).toEqual([outOfStockItem]);
  });

  it("filters production availability independently from quantity status", () => {
    const cannotProduceLowStock = preparationItem({
      id: "prep-1",
      category: "Pre-Batch",
      currentAmount: 2,
      minimumAmount: 5,
      ingredients: [{ name: "Lime", amount: 100, unit: "ml", inventoryItemId: "inv-1" }],
    });
    const canProduceLowStock = preparationItem({
      id: "prep-2",
      category: "Pre-Batch",
      currentAmount: 2,
      minimumAmount: 5,
      ingredients: [{ name: "Mint", amount: 10, unit: "g", inventoryItemId: "inv-2" }],
    });

    expect(
      filterPreparationItems(
        [cannotProduceLowStock, canProduceLowStock],
        {
          search: "",
          category: "All",
          stockStatus: "low-stock",
          productionStatus: "cannot-produce",
        },
        [
          inventoryItem({ id: "inv-1", currentQuantity: 0 }),
          inventoryItem({ id: "inv-2", currentQuantity: 10 }),
        ],
      ),
    ).toEqual([cannotProduceLowStock]);
  });

  it("does not treat non-pre-batch preparations as production-filter matches", () => {
    const syrup = preparationItem({
      category: "Syrup",
      ingredients: [{ name: "Lime", amount: 100, unit: "ml", inventoryItemId: "inv-1" }],
    });

    expect(isCannotProduce(syrup, [inventoryItem({ id: "inv-1", currentQuantity: 0 })])).toBe(
      false,
    );
    expect(
      filterPreparationItems(
        [syrup],
        {
          search: "",
          category: "All",
          stockStatus: "All",
          productionStatus: "cannot-produce",
        },
        [inventoryItem({ id: "inv-1", currentQuantity: 0 })],
      ),
    ).toEqual([]);
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
