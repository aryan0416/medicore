"use client";

import { useState } from "react";
import { Receipt, DollarSign, Wallet, ArrowUpRight, Plus, Download } from "lucide-react";
import { InvoicesTable } from "@/features/billing/components/InvoicesTable";
import { PaymentsTable } from "@/features/billing/components/PaymentsTable";
import { useBillingInvoices, useBillingPayments } from "@/features/billing/hooks/useBilling";
import { Skeleton } from "@/components/ui/skeleton";


export default function BillingPage() {
    const [activeTab, setActiveTab] = useState<"invoices" | "payments">("invoices");

    // Real data fetching connected to our Express backend!
    const { data: invoicesData, isLoading: isLoadingInvoices } = useBillingInvoices();
    const { data: paymentsData, isLoading: isLoadingPayments } = useBillingPayments();

    const INVOICES = invoicesData?.data || [];
    const PAYMENTS = paymentsData?.data || [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
                        Financial & Billing
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage patient invoices, track payments, and monitor revenue.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-border/50 text-foreground font-medium rounded-xl hover:bg-muted/50 transition-colors shadow-sm text-sm">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 text-sm">
                        <Plus className="w-4 h-4" />
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* KPI 1 */}
                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex items-center gap-3 mb-3 relative">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-foreground">$124,500</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium relative">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>12.5% from last month</span>
                    </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
                    <div className="flex items-center gap-3 mb-3 relative">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Receivables</p>
                            <h3 className="text-2xl font-bold text-foreground">$18,240</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium relative">
                        <span>42 open invoices</span>
                    </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
                    <div className="flex items-center gap-3 mb-3 relative">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                            <h3 className="text-2xl font-bold text-foreground">$4,300</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-rose-600 dark:text-rose-400 font-medium relative">
                        <span>Needs immediate attention</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                {/* Tabs */}
                <div className="flex items-center border-b border-border/50 bg-muted/20 px-4">
                    <button
                        onClick={() => setActiveTab("invoices")}
                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "invoices"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        All Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab("payments")}
                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "payments"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Recent Payments
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-5">
                    {activeTab === "invoices" ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg">Invoices</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search invoices..."
                                        className="pl-3 pr-10 py-1.5 bg-muted/50 border border-border/50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 w-64"
                                    />
                                </div>
                            </div>
                            {isLoadingInvoices ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            ) : (
                                <InvoicesTable invoices={INVOICES} />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg">Payments Received</h3>
                            </div>
                            {isLoadingPayments ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            ) : (
                                <PaymentsTable payments={PAYMENTS} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
