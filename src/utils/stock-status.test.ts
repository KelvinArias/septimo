import { describe, expect, it } from "vitest";
import { getStockStatus } from "./stock-status";

describe("getStockStatus", () => {
  it("returns available when quantity is above the minimum", () => {
    expect(getStockStatus(6, 5)).toBe("available");
  });

  it("returns low-stock when quantity equals the minimum", () => {
    expect(getStockStatus(5, 5)).toBe("low-stock");
  });

  it("returns low-stock when quantity is between 1 and the minimum", () => {
    expect(getStockStatus(1, 5)).toBe("low-stock");
  });

  it("returns out-of-stock when quantity is zero", () => {
    expect(getStockStatus(0, 5)).toBe("out-of-stock");
  });

  it("returns out-of-stock when quantity is below zero", () => {
    expect(getStockStatus(-1, 5)).toBe("out-of-stock");
  });
});
