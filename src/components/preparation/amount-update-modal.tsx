import { AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { getNumberInputValue, isLowStock, parseNumberInputValue } from "@/lib/utils";
import type { PreparationItem } from "@/types";

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
            onChange={(event) => setAmount(event.target.value)}
          />
        </Field>
        {isLowStock(nextItem) && (
          <p className="flex items-center gap-2 rounded-md border border-[#f5d190] bg-[#fff8e8] px-3 py-2 text-xs text-[#c45500]">
            <AlertTriangle size={13} /> Below minimum of {item.minimumAmount} {item.unit} - a
            preparation task will be created automatically.
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
