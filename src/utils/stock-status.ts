export type StockStatus = "available" | "low-stock" | "out-of-stock";
export type StockStatusFilter = "All" | StockStatus;

export function getStockStatus(quantity: number, minimumAmount: number): StockStatus {
  if (quantity <= 0) {
    return "out-of-stock";
  }

  if (quantity <= minimumAmount) {
    return "low-stock";
  }

  return "available";
}

export function isLowStockStatus(status: StockStatus) {
  return status === "low-stock";
}

export function isOutOfStockStatus(status: StockStatus) {
  return status === "out-of-stock";
}
