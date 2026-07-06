export type AppView = "inventory" | "preparation" | "tasks" | "completed";

export type NavigationItem = {
  href: string;
  label: string;
  mobileLabel: string;
  view: AppView;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/inventory",
    label: "Inventory",
    mobileLabel: "Stock",
    view: "inventory",
  },
  {
    href: "/preparation",
    label: "Preparation",
    mobileLabel: "Prep",
    view: "preparation",
  },
  {
    href: "/tasks",
    label: "Tasks",
    mobileLabel: "Tasks",
    view: "tasks",
  },
  {
    href: "/completed-tasks",
    label: "Completed",
    mobileLabel: "Done",
    view: "completed",
  },
];
