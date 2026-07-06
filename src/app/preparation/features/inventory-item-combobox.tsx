import { Check, ChevronDown } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { QuickCreateInventoryItem } from "./quick-create-inventory-item";
import { classNames } from "@/utils";
import { normalizeInventoryName } from "@/app/inventory/utils/inventory.utils";
import type {
  InventoryCategory,
  InventoryItem,
} from "@/app/inventory/types/inventory";
import type { Unit } from "@/types";

type InventoryItemComboboxProps = {
  inventoryItems: InventoryItem[];
  placeholder?: string;
  selectedItemId?: string;
  unit: Unit;
  value: string;
  onCreateItem: (
    name: string,
    category: InventoryCategory,
    unit: Unit,
  ) => Promise<InventoryItem | null>;
  onSelect: (item: InventoryItem) => void;
};

export function InventoryItemCombobox({
  inventoryItems,
  placeholder = "Search inventory item...",
  selectedItemId,
  unit,
  value,
  onCreateItem,
  onSelect,
}: InventoryItemComboboxProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPointerDownInsideRef = useRef(false);
  const listboxId = useId();

  const matches = useMemo(() => {
    const normalizedQuery = normalizeInventoryName(query);

    return inventoryItems
      .filter((item) => item.active)
      .filter((item) => {
        if (!normalizedQuery) return true;

        return normalizeInventoryName(item.name).includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [inventoryItems, query]);

  const exactMatch = inventoryItems.find(
    (item) => normalizeInventoryName(item.name) === normalizeInventoryName(query),
  );
  const canQuickCreate = query.trim() && !exactMatch;

  async function handleCreate(
    name: string,
    category: InventoryCategory,
    selectedUnit: Unit,
  ) {
    setIsCreating(true);
    setError(null);

    try {
      const createdItem = await onCreateItem(name, category, selectedUnit);

      if (createdItem) {
        setQuery(createdItem.name);
        onSelect(createdItem);
        setIsOpen(false);
      }

      return createdItem;
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create inventory item.",
      );
      return null;
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        const nextFocusedElement = event.relatedTarget;

        if (isPointerDownInsideRef.current) {
          return;
        }

        if (
          nextFocusedElement instanceof Node &&
          event.currentTarget.contains(nextFocusedElement)
        ) {
          return;
        }

        window.setTimeout(() => setIsOpen(false), 120);
      }}
      onMouseDownCapture={() => {
        isPointerDownInsideRef.current = true;
        window.setTimeout(() => {
          isPointerDownInsideRef.current = false;
        }, 0);
      }}
    >
      <div className="relative">
        <input
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="input pr-9"
          placeholder={placeholder}
          role="combobox"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
            setError(null);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (!isOpen && ["ArrowDown", "Enter"].includes(event.key)) {
              setIsOpen(true);
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlightedIndex((current) => Math.min(current + 1, matches.length - 1));
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlightedIndex((current) => Math.max(current - 1, 0));
            }

            if (event.key === "Enter" && matches[highlightedIndex]) {
              event.preventDefault();
              const selectedItem = matches[highlightedIndex];
              setQuery(selectedItem.name);
              onSelect(selectedItem);
              setIsOpen(false);
            }

            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
        />
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d877f]"
          size={15}
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border border-[#d8d4cc] bg-white shadow-lg">
          <div id={listboxId} role="listbox">
            {matches.map((item, index) => (
              <button
                key={item.id}
                className={classNames(
                  "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition",
                  highlightedIndex === index && "bg-[#f4f2ef]",
                )}
                role="option"
                type="button"
                aria-selected={item.id === selectedItemId}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  setQuery(item.name);
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.name}</span>
                  <span className="block text-xs text-[#7b756d]">
                    {item.category} - {item.currentQuantity} {item.unit}
                  </span>
                </span>
                {item.id === selectedItemId && <Check size={14} />}
              </button>
            ))}
            {matches.length === 0 && (
              <p className="px-3 py-2 text-sm text-[#7b756d]">No matching inventory items.</p>
            )}
          </div>
          {canQuickCreate && (
            <QuickCreateInventoryItem
              defaultName={query}
              defaultUnit={unit}
              isSaving={isCreating}
              onCreate={handleCreate}
            />
          )}
          {error && <p className="border-t border-red-100 px-3 py-2 text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
