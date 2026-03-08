import { cn } from "@/lib/utils";
import { InvoiceStatus } from "../billing.types";

interface StatusBadgeProps {
    status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<InvoiceStatus, string> = {
        Paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
        Overdue: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                styles[status]
            )}
        >
            {status}
        </span>
    );
}
