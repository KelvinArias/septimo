import { CheckCircle2, X } from "lucide-react";
import { classNames } from "@/utils";

type ToastProps = {
  message: string;
  onClose: () => void;
  tone?: "success";
};

export function Toast({ message, onClose, tone = "success" }: ToastProps) {
  const toneStyles = {
    success: "border-emerald-200 bg-white text-[#1f3d32]",
  };

  return (
    <div className="fixed inset-x-4 bottom-20 z-50 md:bottom-6 md:left-auto md:right-6 md:w-full md:max-w-sm">
      <div
        className={classNames(
          "flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-lg",
          toneStyles[tone],
        )}
      >
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
        <p className="min-w-0 flex-1 leading-5">{message}</p>
        <button
          className="-mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#6b655d] transition hover:bg-[#efebe4]"
          title="Dismiss message"
          type="button"
          onClick={onClose}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
