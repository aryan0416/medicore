"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Stethoscope, Building2, Bot,
  TrendingUp, TrendingDown, ArrowRight,
  UserPlus, MessageSquare, Calendar,
  Activity, Clock, AlertCircle,
  FlaskConical, BedDouble,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Helpers ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Types ── */
type KpiCard = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  primaryColor: string;
  bgColor: string;
};

type ActivityItem = {
  id: string;
  type: "patient" | "encounter" | "alert";
  text: string;
  time: string;
};

/* ── Static demo data ── */
const KPI_CARDS: KpiCard[] = [
  {
    title: "Total Patients",
    value: "1,284",
    change: "+12 this week",
    trend: "up",
    icon: Users,
    primaryColor: "oklch(0.60 0.16 160)", // Emerald Primary
    bgColor: "oklch(0.60 0.16 160 / 0.10)",
  },
  {
    title: "Active Encounters",
    value: "47",
    change: "+3 today",
    trend: "up",
    icon: Stethoscope,
    primaryColor: "oklch(0.55 0.14 230)", // Classic medical blue
    bgColor: "oklch(0.55 0.14 230 / 0.10)",
  },
  {
    title: "Departments",
    value: "24",
    change: "All operational",
    trend: "neutral",
    icon: Building2,
    primaryColor: "oklch(0.65 0.18 40)", // Warm orange
    bgColor: "oklch(0.65 0.18 40 / 0.10)",
  },
  {
    title: "AI Consultations",
    value: "318",
    change: "+28 this week",
    trend: "up",
    icon: Bot,
    primaryColor: "oklch(0.62 0.16 280)", // Purple tech
    bgColor: "oklch(0.62 0.16 280 / 0.10)",
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "1", type: "patient", text: "New patient Arjun Mehta registered", time: "2 min ago" },
  { id: "2", type: "encounter", text: "Encounter #ENC-0048 marked as Complete", time: "14 min ago" },
  { id: "3", type: "alert", text: "ICU Bed 4 — requires attention", time: "31 min ago" },
  { id: "4", type: "patient", text: "Priya Sharma discharged from Ward B", time: "1 hr ago" },
  { id: "5", type: "encounter", text: "New encounter started for Rajan Devi", time: "2 hr ago" },
];

const QUICK_ACTIONS = [
  { label: "New Patient", href: "/dashboard/patients/new", icon: UserPlus, color: "oklch(0.60 0.16 160)" },
  { label: "New Encounter", href: "/dashboard/encounters", icon: Calendar, color: "oklch(0.55 0.14 230)" },
  { label: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare, color: "oklch(0.62 0.16 280)" },
  { label: "Lab Orders", href: "/dashboard/lab", icon: FlaskConical, color: "oklch(0.55 0.14 230)" },
  { label: "Bed Management", href: "/dashboard/beds", icon: BedDouble, color: "oklch(0.60 0.15 25)" },
];

/* ── Component ── */
export default function DashboardPage() {
  const supabase = createClient();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Doctor";
      setUserName(name);
    });
  }, []);

  const activityIcon = (type: ActivityItem["type"]) => {
    if (type === "patient") return <UserPlus size={14} />;
    if (type === "encounter") return <Stethoscope size={14} />;
    return <AlertCircle size={14} />;
  };
  const activityColor = (type: ActivityItem["type"]) => {
    if (type === "patient") return "oklch(0.60 0.16 160)";
    if (type === "encounter") return "oklch(0.55 0.14 230)";
    return "oklch(0.65 0.18 40)";
  };

  return (
    <div className="space-y-8 animate-fade-in p-2">

      {/* ── Welcome banner ── */}
      <div
        className="relative overflow-hidden rounded-[20px] px-8 py-8 flex items-center justify-between shadow-sm border border-border"
        style={{
          background: "linear-gradient(135deg, oklch(0.99 0.01 240) 0%, oklch(0.96 0.03 210) 100%)",
        }}
      >
        {/* Soft floating blob */}
        <div className="absolute right-[-5%] top-[-10%] w-96 h-96 opacity-[0.08] blur-[80px] rounded-full gradient-teal pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">
            {getGreeting()} 👋
          </p>
          <h2 className="font-display font-bold text-3xl text-foreground tracking-tight">
            {userName ? `Welcome, ${userName}` : "Welcome to MediCore"}
          </h2>
          <p className="text-[15px] font-medium text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-border shadow-sm text-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Overview Snapshot</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="stat-card group bg-white hover:border-border hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center shadow-sm"
                    style={{ background: card.bgColor }}
                  >
                    <Icon size={20} style={{ color: card.primaryColor }} />
                  </div>
                  {card.trend === "up" && <div className="flex items-center text-emerald-500 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-md mt-1"><TrendingUp size={14} className="mr-1" /> Up</div>}
                  {card.trend === "down" && <div className="flex items-center text-red-500 text-xs font-semibold bg-red-50 px-2 py-1 rounded-md mt-1"><TrendingDown size={14} className="mr-1" /> Down</div>}
                  {card.trend === "neutral" && <div className="flex items-center text-muted-foreground text-xs font-semibold bg-muted px-2 py-1 rounded-md mt-1"><Activity size={14} className="mr-1" /> Stable</div>}
                </div>

                <p className="font-display font-bold text-[28px] text-foreground tracking-tight leading-none mb-1.5">{card.value}</p>
                <p className="text-[15px] font-semibold text-muted-foreground">{card.title}</p>

                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary group-hover:w-full transition-all duration-300 ease-in-out" style={{ background: card.primaryColor }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-[20px] border border-border bg-white p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground tracking-tight">Recent Activity</h3>
              <p className="text-[13px] font-medium text-muted-foreground mt-0.5">Live updates from the hospital floors</p>
            </div>
          </div>

          <div className="space-y-2">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3.5 rounded-[14px] transition-all hover:bg-muted/50 border border-transparent hover:border-border"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: `${activityColor(item.type)}15`, color: activityColor(item.type) }}
                >
                  {activityIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-foreground font-semibold leading-snug">{item.text}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock size={12} className="text-muted-foreground" />
                    <p className="text-[11px] font-medium text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="mb-5">
            <h3 className="font-display font-bold text-lg text-foreground tracking-tight">Quick Actions</h3>
            <p className="text-[13px] font-medium text-muted-foreground mt-0.5">Common tasks at a glance</p>
          </div>

          <div className="space-y-3 flex-1">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] border border-border bg-background transition-all duration-200 group hover:shadow-sm hover:border-transparent"
                style={{ "--tw-ring-color": color } as React.CSSProperties}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="text-[14px] font-semibold text-foreground flex-1">{label}</span>
                <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
              </Link>
            ))}
          </div>

          {/* Dept summary */}
          <div className="mt-6 pt-5 border-t border-border space-y-4">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Dept. Bed Utilisation</h4>
            <div className="space-y-3">
              {[
                { dept: "Emergency", pct: 90, color: "oklch(0.65 0.18 40)" },
                { dept: "General Ward", pct: 72, color: "oklch(0.60 0.16 160)" },
                { dept: "ICU", pct: 85, color: "oklch(0.55 0.14 230)" },
              ].map(({ dept, pct, color }) => (
                <div key={dept} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-semibold">{dept}</span>
                    <span className="text-muted-foreground font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-[inset_0_1px_rgba(255,255,255,0.4)]"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
