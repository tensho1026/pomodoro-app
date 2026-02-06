import {
  BarChart3,
  CalendarDays,
  House,
  PenSquare,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const APP_NAV_ITEMS: NavigationItem[] = [
  {
    href: "/",
    label: "ホーム",
    icon: House,
  },
  {
    href: "/record",
    label: "記録",
    icon: PenSquare,
  },
  {
    href: "/history",
    label: "履歴",
    icon: CalendarDays,
  },
  {
    href: "/analytics",
    label: "分析",
    icon: BarChart3,
  },
];
