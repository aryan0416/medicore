import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ReportCardProps {
    title: string;
    value: string | number;
    trend: string;
    isPositive: boolean;
    icon: LucideIcon;
    colorClass: string;
}

export function ReportCard({ title, value, trend, isPositive, icon: Icon, colorClass }: ReportCardProps) {
    return (
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            {/* Decorative Blur */}
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-all", colorClass)} />

            <div className="flex items-center gap-3 mb-3 relative">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center opacity-90", colorClass.replace('bg-', 'bg-').replace('text-', 'bg-').replace('500', '500/10'))}>
                    <Icon className={cn("w-5 h-5", colorClass.replace('bg-', 'text-'))} />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                </div>
            </div>

            <div className={cn(
                "flex items-center gap-1.5 text-sm font-medium relative",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}>
                <span>{trend}</span>
            </div>
        </div>
    );
}
