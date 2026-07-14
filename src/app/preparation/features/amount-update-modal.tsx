import { AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  getNumberInputValue,
  normalizeNumberInputValue,
  parseNumberInputValue,
} from "@/utils";
import { getPreparationStockStatus } from "@/app/preparation/utils/preparation.utils";
import type { PreparationItem } from "@/app/preparation/types/preparation";

type AmountUpdateModalProps = {
  item: PreparationItem;
  onClose: () => void;
  onUpdateAmount: (id: string, amount: number) => void;
};

export function AmountUpdateModal({
  item,
  onClose,
  onUpdateAmount,
}: AmountUpdateModalProps) {
  const [amount, setAmount] = useState(getNumberInputValue(item.currentAmount));
  const nextItem = { ...item, currentAmount: parseNumberInputValue(amount) };
  const stockStatus = getPreparationStockStatus(nextItem);

  return (
    <Modal title="Update Amount" subtitle={item.name} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdateAmount(item.id, parseNumberInputValue(amount));
          onClose();
        }}
      >
        <Field label={`Current Amount (${item.unit})`} required>
          <input
            className="input min-h-11 text-base"
            min="0"
            step="0.1"
            type="number"
            value={amount}
            onChange={(event) => setAmount(normalizeNumberInputValue(event.target.value))}
          />
        </Field>
        {stockStatus !== "available" && (
          <p
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
              stockStatus === "out-of-stock"
                ? "border-[#f1a4a4] bg-[#fff1f1] text-[#b42318]"
                : "border-[#f5d190] bg-[#fff8e8] text-[#c45500]"
            }`}
          >
            <AlertTriangle size={13} />
            {stockStatus === "out-of-stock"
              ? `Out of stock. Minimum is ${item.minimumAmount} ${item.unit}; a preparation task will be created automatically.`
              : `Below minimum of ${item.minimumAmount} ${item.unit}; a preparation task will be created automatically.`}
          </p>
        )}
        <div className="grid gap-2 border-t border-[#e4e0d8] pt-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Check size={16} /> Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
