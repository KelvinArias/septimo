import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#111111] text-white hover:bg-black inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition lg:min-h-9",
  secondary:
    "border border-[#d8d4cc] bg-white text-[#5f5a52] hover:border-[#aaa398] inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition lg:min-h-9",
  ghost:
    "text-[#5f5a52] hover:bg-[#efebe4] hover:text-[#111111] inline-flex h-8 items-center justify-center rounded-md px-2 text-sm transition",
};

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={classNames(buttonStyles[variant], className)} type={type} {...props}>
      {children}
    </button>
  );
}
