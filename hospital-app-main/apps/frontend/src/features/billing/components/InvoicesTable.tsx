import { Invoice } from "../billing.types";
import { StatusBadge } from "./StatusBadge";
import { FileText, MoreHorizontal } from "lucide-react";

interface InvoicesTableProps {
    invoices: Invoice[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Invoice ID</th>
                            <th className="px-6 py-4 font-semibold">Patient</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{invoice.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">{invoice.patientName}</td>
                                <td className="px-6 py-4 text-muted-foreground">{invoice.date}</td>
                                <td className="px-6 py-4 font-semibold">${invoice.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                    No invoices found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
