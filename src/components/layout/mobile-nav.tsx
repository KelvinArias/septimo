import type { AppView } from "@/types";

type MobileNavProps = {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
};

export function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  return (
    <select
      className="h-9 rounded-md border border-[#d8d4cc] bg-white px-3 text-sm lg:hidden"
      value={activeView}
      onChange={(event) => onViewChange(event.target.value as AppView)}
    >
      <option value="preparation">Preparation</option>
      <option value="tasks">Tasks</option>
      <option value="completed">Completed</option>
    </select>
  );
}
