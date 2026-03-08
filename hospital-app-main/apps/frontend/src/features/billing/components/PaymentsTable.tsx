import { Payment } from "../billing.types";
import { CreditCard, MoreHorizontal, Banknote, Building, ShieldCheck } from "lucide-react";

interface PaymentsTableProps {
    payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
    const getMethodIcon = (method: string) => {
        switch (method) {
            case "Credit Card":
                return <CreditCard className="w-4 h-4 text-blue-500" />;
            case "Bank Transfer":
                return <Building className="w-4 h-4 text-purple-500" />;
            case "Cash":
                return <Banknote className="w-4 h-4 text-emerald-500" />;
            case "Insurance":
                return <ShieldCheck className="w-4 h-4 text-amber-500" />;
            default:
                return <CreditCard className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Payment ID</th>
                            <th className="px-6 py-4 font-semibold">Patient</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Method</th>
                            <th className="px-6 py-4 font-semibold">Reference</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 font-medium">{payment.id}</td>
                                <td className="px-6 py-4 font-medium">{payment.patientName}</td>
                                <td className="px-6 py-4 text-muted-foreground">{payment.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getMethodIcon(payment.method)}
                                        <span>{payment.method}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground text-xs font-mono">{payment.reference}</td>
                                <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                    +${payment.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                    No payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
