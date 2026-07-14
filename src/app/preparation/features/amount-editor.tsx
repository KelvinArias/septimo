"use client";

import { useState } from "react";
import {
  classNames,
  getNumberInputValue,
  normalizeNumberInputValue,
  parseNumberInputValue,
} from "@/utils";
import { getPreparationStockStatus } from "@/app/preparation/utils/preparation.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";

type AmountEditorProps = {
  item: PreparationItem;
  onUpdateAmount: (id: string, amount: number) => void;
};

export function AmountEditor({ item, onUpdateAmount }: AmountEditorProps) {
  const [value, setValue] = useState(getNumberInputValue(item.currentAmount));
  const stockStatus = getPreparationStockStatus(item);

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
          stockStatus === "out-of-stock" && "border-[#d92d20] text-[#b42318]",
          stockStatus === "low-stock" && "border-[#f1b56a] text-[#c45500]",
          stockStatus === "available" && "border-[#d8d4cc]",
        )}
        step="0.1"
        type="number"
        value={value}
        onChange={(event) => setValue(normalizeNumberInputValue(event.target.value))}
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
