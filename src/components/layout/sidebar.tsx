import { CheckCircle2, ClipboardList, FlaskConical } from "lucide-react";
import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";
import type { AppView } from "@/types";

type SidebarProps = {
  activeView: AppView;
  pendingTaskCount: number;
  onViewChange: (view: AppView) => void;
};

export function Sidebar({ activeView, pendingTaskCount, onViewChange }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[196px] border-r border-white/10 bg-[#111111] text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-5 py-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Septimo PI
        </p>
        <h1 className="mt-1 text-sm font-semibold">Bar Operations</h1>
      </div>
      <nav className="flex-1 space-y-2 px-3 py-4">
        <NavButton
          active={activeView === "preparation"}
          icon={<FlaskConical size={16} />}
          label="Preparation"
          onClick={() => onViewChange("preparation")}
        />
        <NavButton
          active={activeView === "tasks"}
          badge={pendingTaskCount}
          icon={<ClipboardList size={16} />}
          label="Tasks"
          onClick={() => onViewChange("tasks")}
        />
        <NavButton
          active={activeView === "completed"}
          icon={<CheckCircle2 size={16} />}
          label="Completed"
          onClick={() => onViewChange("completed")}
        />
      </nav>
      <p className="px-5 py-4 text-[11px] text-white/25">v1.0 - Service Ready</p>
    </aside>
  );
}

function NavButton({
  active,
  badge,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  badge?: number;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={classNames(
        "flex h-9 w-full items-center justify-between rounded-md px-3 text-sm font-medium transition",
        active ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/8 hover:text-white",
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {!!badge && (
        <span className="rounded bg-[#f4a000] px-1.5 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
