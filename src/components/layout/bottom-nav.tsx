import { CheckCircle2, ClipboardList, Package } from "lucide-react";
import { classNames } from "@/lib/utils";
import type { AppView } from "@/types";

type BottomNavProps = {
  activeView: AppView;
  pendingTaskCount: number;
  onViewChange: (view: AppView) => void;
};

export function BottomNav({ activeView, pendingTaskCount, onViewChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-3 border-t border-[#dedbd3] bg-white/95 px-3 backdrop-blur lg:hidden">
      <BottomNavButton
        active={activeView === "inventory"}
        icon={<Package size={17} />}
        label="Inventory"
        onClick={() => onViewChange("inventory")}
      />
      <BottomNavButton
        active={activeView === "tasks"}
        badge={pendingTaskCount}
        icon={<ClipboardList size={17} />}
        label="Tasks"
        onClick={() => onViewChange("tasks")}
      />
      <BottomNavButton
        active={activeView === "completed"}
        icon={<CheckCircle2 size={17} />}
        label="Done"
        onClick={() => onViewChange("completed")}
      />
    </nav>
  );
}

function BottomNavButton({
  active,
  badge,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  badge?: number;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={classNames(
        "relative flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition",
        active ? "text-[#111111]" : "text-[#6f6960]",
      )}
      onClick={onClick}
    >
      <span
        className={classNames(
          "absolute top-0 h-px w-20 max-w-[72%] bg-transparent",
          active && "bg-[#111111]",
        )}
      />
      <span className="relative">
        {icon}
        {!!badge && (
          <span className="absolute -right-2 -top-2 rounded-full bg-[#f4a000] px-1 text-[9px] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      {label}
    </button>
  );
}
