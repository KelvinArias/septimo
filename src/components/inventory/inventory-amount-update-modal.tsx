import { AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  getNumberInputValue,
  isInventoryLowStock,
  parseNumberInputValue,
} from "@/lib/utils";
import type { InventoryItem } from "@/types";

type InventoryAmountUpdateModalProps = {
  item: InventoryItem;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
};

export function InventoryAmountUpdateModal({
  item,
  onClose,
  onUpdateQuantity,
}: InventoryAmountUpdateModalProps) {
  const [quantity, setQuantity] = useState(getNumberInputValue(item.currentQuantity));
  const nextItem = { ...item, currentQuantity: parseNumberInputValue(quantity) };

  return (
    <Modal title="Update Quantity" subtitle={item.name} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdateQuantity(item.id, parseNumberInputValue(quantity));
          onClose();
        }}
      >
        <Field label={`Current Quantity (${item.unit})`} required>
          <input
            className="input min-h-11 text-base"
            min="0"
            step="0.1"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </Field>
        {isInventoryLowStock(nextItem) && (
          <p className="flex items-center gap-2 rounded-md border border-[#f5d190] bg-[#fff8e8] px-3 py-2 text-xs text-[#c45500]">
            <AlertTriangle size={13} /> Below minimum of {item.minimumQuantity} {item.unit}.
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
