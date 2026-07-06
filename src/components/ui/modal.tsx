import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  subtitle?: string;
  title: string;
};

export function Modal({ children, onClose, subtitle, title }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 px-0 py-0 md:items-center md:px-4 md:py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-auto rounded-t-xl bg-[#faf9f6] shadow-2xl md:rounded-md">
        <div className="sticky top-0 z-10 border-b border-[#e4e0d8] bg-[#faf9f6] px-4 py-4 md:px-5">
          <div className="mx-auto mb-3 h-1 w-7 rounded-full bg-[#d8d4cc] md:hidden" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-[#6b655d]">{subtitle}</p>}
            </div>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b655d] transition hover:bg-[#efebe4]"
              title="Close"
              onClick={onClose}
            >
              <X size={17} />
            </button>
          </div>
        </div>
        <div className="p-4 md:p-5">{children}</div>
      </div>
    </div>
  );
}
