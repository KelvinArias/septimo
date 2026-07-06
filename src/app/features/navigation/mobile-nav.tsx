"use client";

import { useRouter } from "next/navigation";
import type { AppView } from "@/app/features/navigation/types";
import { navigationItems } from "@/app/features/navigation/types";

type MobileNavProps = {
  activeView: AppView;
};

export function MobileNav({ activeView }: MobileNavProps) {
  const router = useRouter();

  return (
    <select
      className="h-9 rounded-md border border-[#d8d4cc] bg-white px-3 text-sm lg:hidden"
      value={activeView}
      onChange={(event) => {
        const item = navigationItems.find(({ view }) => view === event.target.value);

        if (item) router.push(item.href);
      }}
    >
      {navigationItems.map((item) => (
        <option key={item.view} value={item.view}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
