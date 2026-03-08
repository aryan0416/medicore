"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Activity, ShieldCheck, Users, Stethoscope, Bot } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const stats = [
  { label: "Patients Served", value: "12,480", icon: Users },
  { label: "Departments", value: "24", icon: Stethoscope },
  { label: "AI Consultations", value: "3,200+", icon: Bot },
  { label: "HIPAA Compliant", value: "100%", icon: ShieldCheck },
];

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left hero panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden px-14 py-12 bg-mesh-light border-r border-border"
      >
        {/* Decorative subtle visual elements */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "oklch(0.60 0.16 160)" }}
        />
        <div
          className="absolute bottom-[-100px] right-[-100px] w-80 h-80 rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: "oklch(0.55 0.16 200)" }}
        />

        {/* Top — Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm gradient-teal"
          >
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-lg leading-none">MediCore</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Hospital Management System</p>
          </div>
        </div>

        {/* Middle — Headline */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Enterprise Grade Platform
            </div>

            <h2 className="font-display font-bold text-5xl text-foreground leading-[1.15] tracking-tight">
              Clinical Care,<br />
              <span className="text-gradient-teal">
                Elevated.
              </span>
            </h2>

            <p className="text-[15px] leading-relaxed max-w-[400px] text-muted-foreground font-medium">
              Streamline patient management, encounters, clinical AI insights, and hospital operations in one unified, airy platform.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[20px] p-5 flex flex-col gap-2.5 bg-white/60 border border-white backdrop-blur-xl shadow-sm transition-all hover:bg-white hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-foreground tracking-tight">{value}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-xs font-medium text-muted-foreground/80">
            © 2026 MediCore. All rights reserved. HIPAA Compliant.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-12 relative bg-background">
        <div className="w-full max-w-[420px] mx-auto space-y-8 animate-fade-in relative z-10">

          {/* Mobile brand */}
          <div className="flex items-center gap-3 lg:hidden justify-center mb-8">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center shadow-sm">
              <Activity size={20} className="text-white" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">MediCore</p>
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">Welcome back</h1>
            <p className="text-[15px] text-muted-foreground font-medium">Sign in to your administration account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email address</label>
              <input
                type="email"
                placeholder="you@hospital.com"
                {...register("email")}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-foreground text-[15px] placeholder:text-muted-foreground/70 outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex justify-between">
                Password
                <span className="text-primary cursor-pointer hover:underline">Forgot?</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-foreground text-[15px] placeholder:text-muted-foreground/70 outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="flex items-start gap-3 p-4 rounded-xl text-[13px] bg-red-50 text-red-600 border border-red-100 font-medium">
                <span className="mt-0.5 shrink-0">⚠</span>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-[15px] font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none gradient-teal mt-2"
            >
              {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
              {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </form>

          <p className="text-center text-xs font-medium text-muted-foreground mt-8">
            Secured by <span className="font-semibold text-foreground">Supabase Auth</span>
          </p>
        </div>
      </div>
    </div>
  );
}
