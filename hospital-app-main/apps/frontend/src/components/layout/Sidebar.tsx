"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Activity,
  Shield,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requiredPermission: null },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "Patients", href: "/dashboard/patients", icon: Users, requiredPermission: "patient.read" },
      { title: "Encounters", href: "/dashboard/encounters", icon: Stethoscope, requiredPermission: "encounter.read" },
      { title: "Lab", href: "/dashboard/lab", icon: FlaskConical, requiredPermission: "lab.read" },
      { title: "Pharmacy", href: "/dashboard/pharmacy", icon: Pill, requiredPermission: "pharmacy.read" },
      { title: "Beds", href: "/dashboard/beds", icon: BedDouble, requiredPermission: "bed.read" },
    ],
  },
  {
    label: "Finance & Reports",
    items: [
      { title: "Billing", href: "/dashboard/billing", icon: Receipt, requiredPermission: "billing.read" },
      { title: "Reports", href: "/dashboard/reports", icon: BarChart3, requiredPermission: "reports.read" },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "AI Chat", href: "/dashboard/ai-chat", icon: Bot, requiredPermission: null },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Admin", href: "/dashboard/admin", icon: Settings, requiredPermission: "admin.user.read" },
    ],
  },
];

export function Sidebar({ role, permissions = [] }: { role?: string; permissions?: string[] }) {
  const pathname = usePathname();

  // Filter groups and items based on permissions
  const filteredNavGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (!item.requiredPermission) return true;
      // SuperAdmin usually has all permissions, but just to be safe:
      if (role === "SuperAdmin") return true;

      return permissions.includes(item.requiredPermission);
    })
  })).filter(group => group.items.length > 0);

  return (
    <aside className="w-[260px] flex flex-col hidden md:flex shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border z-30 transition-all">

      {/* Logo / Brand */}
      <div className="h-[72px] flex items-center gap-3.5 px-6 shrink-0 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-xl gradient-teal flex items-center justify-center shadow-sm">
          <Activity size={18} className="text-white" />
        </div>
        <div className="flex flex-col">
          <p className="font-display font-bold text-[17px] tracking-tight text-sidebar-foreground leading-none">
            MediCore
          </p>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
            Clinical System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-4 scrollbar-hide">
        {filteredNavGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-item group relative outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="text-sm font-semibold">{item.title}</span>

                    {/* Active Indicator Glow */}
                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.60_0.16_160)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 shrink-0 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-muted/40 border border-border/50 shadow-sm">
          <div className="w-8 h-8 rounded-[10px] gradient-teal flex items-center justify-center shrink-0 shadow-sm">
            <Shield size={14} className="text-white" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <p className="text-xs font-bold truncate text-sidebar-foreground">Portal Access</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{role || "Staff"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
