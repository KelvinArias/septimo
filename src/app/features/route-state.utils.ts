export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The database request failed.";
}

export function upsertById<TItem extends { id: string }>(items: TItem[], item: TItem) {
  return items.some((currentItem) => currentItem.id === item.id)
    ? items.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
    : [item, ...items];
}
