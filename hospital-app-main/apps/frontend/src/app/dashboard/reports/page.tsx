"use client";

import { Download, Users, TrendingUp, Clock, Building } from "lucide-react";
import { ReportCard } from "@/features/reports/components/ReportCard";
import { ChartPlaceholder } from "@/features/reports/components/ChartPlaceholder";
import { useReports } from "@/features/reports/hooks/useReports";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
    const { data, isLoading } = useReports();
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
                        Hospital Analytics & Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive overview of clinical and financial performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-border/50 text-foreground font-medium rounded-xl hover:bg-muted/50 transition-colors shadow-sm text-sm">
                        <Download className="w-4 h-4" />
                        Export Selected
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {isLoading ? (
                    <>
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                    </>
                ) : (
                    <>
                        <ReportCard
                            title="Patient Admissions"
                            value={data?.admissions?.value || "0"}
                            trend={data?.admissions?.trend || ""}
                            isPositive={data?.admissions?.isPositive ?? true}
                            icon={Users}
                            colorClass="bg-blue-500"
                        />
                        <ReportCard
                            title="Total Revenue"
                            value={data?.revenue?.value || "$0"}
                            trend={data?.revenue?.trend || ""}
                            isPositive={data?.revenue?.isPositive ?? true}
                            icon={TrendingUp}
                            colorClass="bg-emerald-500"
                        />
                        <ReportCard
                            title="Average Wait Time"
                            value={data?.waitTime?.value || "0m"}
                            trend={data?.waitTime?.trend || ""}
                            isPositive={data?.waitTime?.isPositive ?? true}
                            icon={Clock}
                            colorClass="bg-purple-500"
                        />
                        <ReportCard
                            title="Ward Occupancy Rate"
                            value={data?.occupancy?.value || "0%"}
                            trend={data?.occupancy?.trend || ""}
                            isPositive={data?.occupancy?.isPositive ?? true}
                            icon={Building}
                            colorClass="bg-amber-500"
                        />
                    </>
                )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <ChartPlaceholder title="Revenue & Expense Trend" type="line" height="h-80" />
                </div>
                <div className="lg:col-span-1">
                    <ChartPlaceholder title="Patient Demographics" type="pie" height="h-80" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartPlaceholder title="Department Activity" type="bar" />
                <ChartPlaceholder title="Monthly Admissions" type="bar" />
            </div>
        </div>
    );
}
