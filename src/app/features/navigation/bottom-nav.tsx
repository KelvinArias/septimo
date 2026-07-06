import { CheckCircle2, ClipboardList, FlaskConical, Package } from "lucide-react";
import Link from "next/link";
import { classNames } from "@/utils";
import type { AppView } from "@/app/features/navigation/types";

type BottomNavProps = {
  activeView: AppView;
  pendingTaskCount: number;
};

export function BottomNav({ activeView, pendingTaskCount }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-4 border-t border-[#dedbd3] bg-white/95 px-2 backdrop-blur lg:hidden">
      <BottomNavButton
        active={activeView === "inventory"}
        href="/inventory"
        icon={<Package size={17} />}
        label="Stock"
      />
      <BottomNavButton
        active={activeView === "preparation"}
        href="/preparation"
        icon={<FlaskConical size={17} />}
        label="Prep"
      />
      <BottomNavButton
        active={activeView === "tasks"}
        badge={pendingTaskCount}
        href="/tasks"
        icon={<ClipboardList size={17} />}
        label="Tasks"
      />
      <BottomNavButton
        active={activeView === "completed"}
        href="/completed-tasks"
        icon={<CheckCircle2 size={17} />}
        label="Done"
      />
    </nav>
  );
}

function BottomNavButton({
  active,
  badge,
  href,
  icon,
  label,
}: {
  active: boolean;
  badge?: number;
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      className={classNames(
        "relative flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition",
        active ? "text-[#111111]" : "text-[#6f6960]",
      )}
      href={href}
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
    </Link>
  );
}
