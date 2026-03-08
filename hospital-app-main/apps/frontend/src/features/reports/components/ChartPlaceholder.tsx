import { cn } from "@/lib/utils";
import { BarChart3, LineChart, PieChart } from "lucide-react";

interface ChartPlaceholderProps {
    title: string;
    type: "bar" | "line" | "pie";
    height?: string;
}

export function ChartPlaceholder({ title, type, height = "h-64" }: ChartPlaceholderProps) {
    const Icon = type === "bar" ? BarChart3 : type === "line" ? LineChart : PieChart;

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col">
            <h3 className="font-semibold text-lg mb-4">{title}</h3>
            <div className={cn("w-full rounded-xl border border-dashed border-border flex flex-col items-center justify-center bg-muted/10", height)}>
                <Icon className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground font-medium">Interactive {type} chart visualization</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Requires chart.js or Recharts integration</p>
            </div>
        </div>
    );
}
