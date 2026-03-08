"use client";

import { Bell, Loader2, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/patients": "Patients Directory",
  "/dashboard/encounters": "Clinical Encounters",
  "/dashboard/billing": "Billing & Invoices",
  "/dashboard/lab": "Laboratory",
  "/dashboard/pharmacy": "Pharmacy",
  "/dashboard/beds": "Bed Management",
  "/dashboard/reports": "Analytics & Reports",
  "/dashboard/settings": "General Settings",
  "/dashboard/ai-chat": "Clinical AI Assistant",
  "/dashboard/admin": "Administration",
};

function getInitials(email: string | undefined): string {
  if (!email) return "U";
  return email.slice(0, 2).toUpperCase();
}

export function Header({ user, role }: { user: User | null; role?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key) && key !== "/dashboard" ? true : pathname === key)
    ?.[1] ?? "Dashboard";

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header
      className="h-[72px] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm transition-all"
    >
      {/* Left — Page title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-display font-semibold text-xl tracking-tight text-foreground">
            {pageTitle}
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Right Structure - Improved Spacing & Cleanliness */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-colors text-muted-foreground focus-within:bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 shadow-sm w-64">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search patients, doctors..."
            className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 h-5 text-[10px] font-mono font-medium bg-background border border-border rounded text-muted-foreground shrink-0 shadow-sm">
            ⌘K
          </kbd>
        </div>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-foreground transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive border-2 border-background rounded-full" />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-foreground transition-colors hidden sm:flex">
            <Settings size={18} />
          </Button>
        </div>

        {/* User dropdown widget */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-[14px] border border-border bg-card hover:bg-muted/50 transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 gradient-teal shadow-sm"
              >
                {getInitials(user?.email)}
              </div>
              <div className="hidden sm:flex flex-col items-start min-w-0 pr-1">
                <span className="text-sm font-semibold text-foreground leading-none max-w-[120px] truncate">
                  {user?.email?.split("@")[0] ?? "Admin Name"}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium mt-1">
                  {role || "Staff"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border p-1 bg-card/95 backdrop-blur-xl">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{user?.email?.split("@")[0] ?? "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="p-2.5 rounded-lg cursor-pointer hover:bg-muted">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2.5 rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              {isLoggingOut && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
