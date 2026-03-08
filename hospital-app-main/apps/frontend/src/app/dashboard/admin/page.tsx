"use client";

import Link from "next/link";
import { Users, Building2, Shield, Activity, ArrowRight, Settings, Database, HardDrive } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
                        System Administration
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your hospital's system, organizational structure, and user access.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                {/* User Management Card */}
                <Link
                    href="/dashboard/admin/users"
                    className="group bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-blue-500/30"
                >
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />

                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="p-2 bg-muted/50 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-2">User Management</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Add new staff members, disable accounts, and map doctors to specific departments.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Requires Admin privileges</span>
                    </div>
                </Link>

                {/* Departments Card */}
                <Link
                    href="/dashboard/admin/departments"
                    className="group bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-emerald-500/30"
                >
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />

                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Building2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="p-2 bg-muted/50 rounded-full group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-2">Department Structure</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Configure hospital wards, organizational units, and structural routing.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Organizational core</span>
                    </div>
                </Link>
            </div>

            {/* System Status Section */}
            <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">System Status</h3>
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/50">

                    <div className="flex flex-col gap-2 md:pl-none">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Database className="w-4 h-4" />
                            <span className="text-sm font-medium">Database</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_oklch(0.60_0.16_160)]" />
                            <span className="font-semibold">Connected (99.9% Uptime)</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <HardDrive className="w-4 h-4" />
                            <span className="text-sm font-medium">Storage</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-xs font-medium mt-1">45% used of 1TB cluster</span>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm font-medium">API Version</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">v2.4.1</span>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Latest</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
