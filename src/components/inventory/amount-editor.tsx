"use client";

import { useState } from "react";
import {
  classNames,
  getNumberInputValue,
  isLowStock,
  parseNumberInputValue,
} from "@/lib/utils";
import type { InventoryItem } from "@/types";

type AmountEditorProps = {
  item: InventoryItem;
  onUpdateAmount: (id: string, amount: number) => void;
};

export function AmountEditor({ item, onUpdateAmount }: AmountEditorProps) {
  const [value, setValue] = useState(getNumberInputValue(item.currentAmount));

  return (
    <form
      className="flex max-w-[170px] items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onUpdateAmount(item.id, parseNumberInputValue(value));
      }}
    >
      <input
        className={classNames(
          "h-8 w-20 rounded-md border bg-white px-2 font-mono text-sm outline-none focus:border-[#aaa398]",
          isLowStock(item) ? "border-[#f1b56a] text-[#c45500]" : "border-[#d8d4cc]",
        )}
        step="0.1"
        type="number"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        className="inline-flex h-8 items-center justify-center rounded-md border border-[#d8d4cc] bg-white px-3 text-xs font-semibold text-[#58534c] transition hover:border-[#aaa398] hover:bg-[#f7f6f3]"
        title="Update current amount"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
