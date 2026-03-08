import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Receipt,
  FlaskConical,
  Pill,
  BedDouble,
  BarChart3,
  Settings,
  Bot,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  permission?: string;
}

export const dashboardNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
    permission: "patient.read",
  },
  {
    title: "Encounters",
    href: "/dashboard/encounters",
    icon: Stethoscope,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: Receipt,
  },
  {
    title: "Lab",
    href: "/dashboard/lab",
    icon: FlaskConical,
  },
  {
    title: "Pharmacy",
    href: "/dashboard/pharmacy",
    icon: Pill,
  },
  {
    title: "Beds",
    href: "/dashboard/beds",
    icon: BedDouble,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "AI Chat",
    href: "/dashboard/ai-chat",
    icon: Bot,
  },
];
