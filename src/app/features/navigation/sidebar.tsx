import { CheckCircle2, ClipboardList, FlaskConical, Package } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/utils";
import type { AppView } from "@/app/features/navigation/types";

type SidebarProps = {
  activeView: AppView;
  pendingTaskCount: number;
};

export function Sidebar({ activeView, pendingTaskCount }: SidebarProps) {
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
          active={activeView === "inventory"}
          href="/inventory"
          icon={<Package size={16} />}
          label="Inventory"
        />
        <NavButton
          active={activeView === "preparation"}
          href="/preparation"
          icon={<FlaskConical size={16} />}
          label="Preparation"
        />
        <NavButton
          active={activeView === "tasks"}
          badge={pendingTaskCount}
          href="/tasks"
          icon={<ClipboardList size={16} />}
          label="Tasks"
        />
        <NavButton
          active={activeView === "completed"}
          href="/completed-tasks"
          icon={<CheckCircle2 size={16} />}
          label="Completed"
        />
      </nav>
      <p className="px-5 py-4 text-[11px] text-white/25">v1.0 - Service Ready</p>
    </aside>
  );
}

function NavButton({
  active,
  badge,
  href,
  icon,
  label,
}: {
  active: boolean;
  badge?: number;
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      className={classNames(
        "flex h-9 w-full items-center justify-between rounded-md px-3 text-sm font-medium transition",
        active ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/8 hover:text-white",
      )}
      href={href}
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
    </Link>
  );
}
