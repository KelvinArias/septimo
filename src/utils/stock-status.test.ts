import { describe, expect, it } from "vitest";
import { getStockStatus } from "./stock-status";

describe("getStockStatus", () => {
  it("returns available when quantity is at least 20% above the minimum", () => {
    expect(getStockStatus(6, 5)).toBe("available");
  });

  it("returns low-stock when quantity is above the minimum but below the 20% buffer", () => {
    expect(getStockStatus(5.9, 5)).toBe("low-stock");
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
