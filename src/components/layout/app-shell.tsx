import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import type { AppView } from "@/types";

type AppShellProps = {
  activeView: AppView;
  action?: ReactNode;
  children: ReactNode;
  pendingTaskCount: number;
  subtitle: string;
  title: string;
  onViewChange: (view: AppView) => void;
};

export function AppShell({
  activeView,
  action,
  children,
  pendingTaskCount,
  subtitle,
  title,
  onViewChange,
}: AppShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f6f3] text-[#111111]">
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden">
        <Sidebar
          activeView={activeView}
          pendingTaskCount={pendingTaskCount}
          onViewChange={onViewChange}
        />

        <section className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden lg:pl-[196px]">
          <div className="sticky top-0 z-10 border-b border-[#dedbd3] bg-[#f7f6f3]/95 px-4 py-4 backdrop-blur md:px-5 lg:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-1 text-sm text-[#5e5a53]">{subtitle}</p>
              </div>
              <div className="hidden gap-2 lg:flex">
                <MobileNav activeView={activeView} onViewChange={onViewChange} />
                {action}
              </div>
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-hidden pb-20 lg:pb-0">{children}</div>
        </section>
      </div>
      <BottomNav
        activeView={activeView}
        pendingTaskCount={pendingTaskCount}
        onViewChange={onViewChange}
      />
      {action && (
        <div className="fixed bottom-16 right-4 z-30 lg:hidden">{action}</div>
      )}
    </main>
  );
}
