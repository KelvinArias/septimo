import type { ReactNode } from "react";
import { classNames } from "@/utils";

type IconButtonProps = {
  children: ReactNode;
  className?: string;
  label: string;
  onClick: () => void;
};

export function IconButton({ children, className, label, onClick }: IconButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex h-10 w-10 items-center justify-center rounded-md text-[#5f5a52] transition hover:bg-[#efebe4] hover:text-[#111111] lg:h-8 lg:w-8",
        className,
      )}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
