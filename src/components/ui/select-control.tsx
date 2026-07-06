import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { classNames } from "@/utils";

type SelectControlProps = SelectHTMLAttributes<HTMLSelectElement> & {
  containerClassName?: string;
};

export function SelectControl({
  children,
  className,
  containerClassName,
  ...props
}: SelectControlProps) {
  return (
    <span className={classNames("relative block w-full", containerClassName)}>
      <select
        className={classNames(
          "input appearance-none pr-10 leading-5",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7b756d]"
        size={16}
      />
    </span>
  );
}
