import type { ReactNode } from "react";

type FieldProps = {
  children: ReactNode;
  label: string;
  required?: boolean;
};

export function Field({ children, label, required }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#6f6960]">
        {label} {required && <span className="text-[#c45500]">*</span>}
      </span>
      {children}
    </label>
  );
}
