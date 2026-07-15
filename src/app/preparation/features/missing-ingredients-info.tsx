"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type MissingIngredient = {
  amount: number;
  name: string;
  unit: string;
};

type MissingIngredientsInfoProps = {
  ingredients: MissingIngredient[];
};

type PopoverPosition = {
  left: number;
  top: number;
};

export function MissingIngredientsInfo({ ingredients }: MissingIngredientsInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const openPopover = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    setIsOpen(true);
  };

  const closePopover = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current || !popoverRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 8;

    const left = Math.min(
      Math.max(viewportPadding, buttonRect.right - popoverRect.width),
      window.innerWidth - popoverRect.width - viewportPadding,
    );
    const topBelow = buttonRect.bottom + gap;
    const topAbove = buttonRect.top - popoverRect.height - gap;
    const top =
      topBelow + popoverRect.height <= window.innerHeight - viewportPadding
        ? topBelow
        : Math.max(viewportPadding, topAbove);

    setPosition({ left, top });
  }, [isOpen, ingredients]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current || !popoverRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportPadding = 12;
      const gap = 8;

      const left = Math.min(
        Math.max(viewportPadding, buttonRect.right - popoverRect.width),
        window.innerWidth - popoverRect.width - viewportPadding,
      );
      const topBelow = buttonRect.bottom + gap;
      const topAbove = buttonRect.top - popoverRect.height - gap;
      const top =
        topBelow + popoverRect.height <= window.innerHeight - viewportPadding
          ? topBelow
          : Math.max(viewportPadding, topAbove);

      setPosition({ left, top });
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (ingredients.length === 0) return null;

  return (
    <div
      className="inline-flex shrink-0"
      onMouseEnter={openPopover}
      onMouseLeave={closePopover}
    >
      <button
        aria-controls={popoverId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#e41f26] transition hover:bg-[#fff1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e41f26]"
        ref={buttonRef}
        type="button"
        onBlur={closePopover}
        onClick={openPopover}
        onFocus={openPopover}
      >
        <Info aria-hidden="true" size={16} />
      </button>
      {isOpen &&
        createPortal(
          <div
            id={popoverId}
            ref={popoverRef}
            role="dialog"
            className="fixed z-50 w-64 rounded-md bg-white px-4 py-4 text-left text-xs text-[#665f58] shadow-[0_14px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
            style={{
              left: position?.left ?? -9999,
              top: position?.top ?? -9999,
            }}
            onMouseEnter={openPopover}
            onMouseLeave={closePopover}
          >
            <span className="block font-semibold text-[#2f2b26]">Missing ingredients</span>
            <ul className="mt-3 space-y-2">
              {ingredients.map((ingredient, index) => (
                <li
                  className="grid grid-cols-[7px_minmax(0,1fr)] items-start gap-2"
                  key={`${ingredient.name}-${ingredient.amount}-${ingredient.unit}-${index}`}
                >
                  <span className="mt-[5px] h-[5px] w-[5px] rounded-full bg-[#e41f26]" />
                  <span>
                    {ingredient.name} - {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
