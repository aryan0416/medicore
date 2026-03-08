"use client";

import { useState, useMemo } from "react";
import {
    FlaskConical, Search, Filter, Clock, CheckCircle2,
    Circle, XCircle, TrendingUp, MoreVertical, ChevronDown,
    Loader2, TestTube2, Microscope, AlertCircle, Download,
    Plus, ArrowRight, Eye,
} from "lucide-react";
import { LabOrder, LabOrderStatus, LabStats } from "@/features/lab/lab.types";

/* ─────────────────────────────────────────────────────────
   DEMO DATA
───────────────────────────────────────────────────────── */
const DEMO_ORDERS: LabOrder[] = [
    { id: "1", orderId: "LAB-0001", patientId: "p1", patientName: "Arjun Mehta", patientUhid: "UH-1001", doctorName: "Dr. Rajesh Kumar", testId: "t1", testName: "Complete Blood Count", testCategory: "Haematology", sampleType: "blood", status: "completed", orderedAt: "2026-03-07T08:00:00Z", collectedAt: "2026-03-07T08:30:00Z", resultAt: "2026-03-07T10:00:00Z", result: "WBC: 6.5 K/µL, RBC: 4.8 M/µL, Hgb: 14.2 g/dL — Normal", },
    { id: "2", orderId: "LAB-0002", patientId: "p2", patientName: "Priya Sharma", patientUhid: "UH-1002", doctorName: "Dr. Anita Desai", testId: "t2", testName: "HbA1c", testCategory: "Biochemistry", sampleType: "blood", status: "completed", orderedAt: "2026-03-07T07:30:00Z", collectedAt: "2026-03-07T08:00:00Z", resultAt: "2026-03-07T11:00:00Z", result: "HbA1c: 7.2% — Slightly elevated, pre-diabetic range", },
    { id: "3", orderId: "LAB-0003", patientId: "p3", patientName: "Rajan Devi", patientUhid: "UH-1003", doctorName: "Dr. Vikram Singh", testId: "t3", testName: "Urine Routine", testCategory: "Microbiology", sampleType: "urine", status: "in_progress", orderedAt: "2026-03-07T09:15:00Z", collectedAt: "2026-03-07T09:45:00Z", },
    { id: "4", orderId: "LAB-0004", patientId: "p4", patientName: "Suresh Patel", patientUhid: "UH-1004", doctorName: "Dr. Rajesh Kumar", testId: "t4", testName: "Lipid Profile", testCategory: "Biochemistry", sampleType: "blood", status: "in_progress", orderedAt: "2026-03-07T09:00:00Z", collectedAt: "2026-03-07T09:30:00Z", },
    { id: "5", orderId: "LAB-0005", patientId: "p5", patientName: "Meena Joshi", patientUhid: "UH-1005", doctorName: "Dr. Sonal Mehta", testId: "t5", testName: "Thyroid Function Test", testCategory: "Endocrinology", sampleType: "blood", status: "pending", orderedAt: "2026-03-07T10:00:00Z", },
    { id: "6", orderId: "LAB-0006", patientId: "p6", patientName: "Gopal Narayan", patientUhid: "UH-1006", doctorName: "Dr. Anita Desai", testId: "t6", testName: "Liver Function Test", testCategory: "Biochemistry", sampleType: "blood", status: "pending", orderedAt: "2026-03-07T10:30:00Z", },
    { id: "7", orderId: "LAB-0007", patientId: "p7", patientName: "Kavita Rao", patientUhid: "UH-1007", doctorName: "Dr. Vikram Singh", testId: "t7", testName: "Blood Culture", testCategory: "Microbiology", sampleType: "blood", status: "pending", orderedAt: "2026-03-07T11:00:00Z", },
    { id: "8", orderId: "LAB-0008", patientId: "p8", patientName: "Dinesh Verma", patientUhid: "UH-1008", doctorName: "Dr. Rajesh Kumar", testId: "t8", testName: "ECG + Troponin", testCategory: "Cardiology", sampleType: "blood", status: "cancelled", orderedAt: "2026-03-06T14:00:00Z", notes: "Patient transferred to another facility", },
    { id: "9", orderId: "LAB-0009", patientId: "p9", patientName: "Anjali Tiwari", patientUhid: "UH-1009", doctorName: "Dr. Sonal Mehta", testId: "t5", testName: "Serum Electrolytes", testCategory: "Biochemistry", sampleType: "blood", status: "completed", orderedAt: "2026-03-06T12:00:00Z", collectedAt: "2026-03-06T12:30:00Z", resultAt: "2026-03-06T14:00:00Z", result: "Na: 138 mEq/L, K: 4.0 mEq/L, Cl: 101 mEq/L — All within normal limits", },
    { id: "10", orderId: "LAB-0010", patientId: "p10", patientName: "Ramesh Gupta", patientUhid: "UH-1010", doctorName: "Dr. Anita Desai", testId: "t9", testName: "COVID-19 RT-PCR", testCategory: "Virology", sampleType: "swab", status: "completed", orderedAt: "2026-03-06T15:00:00Z", collectedAt: "2026-03-06T15:30:00Z", resultAt: "2026-03-06T21:00:00Z", result: "COVID-19 RT-PCR — Negative", },
];

const DEMO_STATS: LabStats = {
    total: 10, pending: 3, inProgress: 2, completed: 4, cancelled: 1,
};

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function statusConfig(status: LabOrderStatus) {
    switch (status) {
        case "pending":
            return { label: "Pending", icon: Circle, color: "oklch(0.65 0.18 40)", bg: "oklch(0.65 0.18 40 / 0.10)" };
        case "in_progress":
            return { label: "In Progress", icon: Loader2, color: "oklch(0.55 0.14 230)", bg: "oklch(0.55 0.14 230 / 0.10)" };
        case "completed":
            return { label: "Completed", icon: CheckCircle2, color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.10)" };
        case "cancelled":
            return { label: "Cancelled", icon: XCircle, color: "oklch(0.60 0.15 25)", bg: "oklch(0.60 0.15 25 / 0.10)" };
    }
}

function sampleBadgeColor(sample: string) {
    switch (sample) {
        case "blood": return { color: "oklch(0.60 0.15 25)", bg: "oklch(0.60 0.15 25 / 0.10)" };
        case "urine": return { color: "oklch(0.65 0.18 90)", bg: "oklch(0.65 0.18 90 / 0.10)" };
        case "swab": return { color: "oklch(0.62 0.16 280)", bg: "oklch(0.62 0.16 280 / 0.10)" };
        default: return { color: "oklch(0.55 0.14 230)", bg: "oklch(0.55 0.14 230 / 0.10)" };
    }
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/* ─────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: LabOrderStatus }) {
    const cfg = statusConfig(status);
    const Icon = cfg.icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide"
            style={{ color: cfg.color, background: cfg.bg }}
        >
            <Icon size={11} className={status === "in_progress" ? "animate-spin" : ""} />
            {cfg.label}
        </span>
    );
}

/* ─────────────────────────────────────────────────────────
   ORDER DETAIL PANEL
───────────────────────────────────────────────────────── */
function OrderDetailPanel({ order, onClose }: { order: LabOrder; onClose: () => void }) {
    const cfg = statusConfig(order.status);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
            <div
                className="w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col animate-fade-in overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lab Order</p>
                        <h3 className="font-display font-bold text-lg text-foreground mt-0.5">{order.orderId}</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                        <XCircle size={16} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Status */}
                    <div className="flex items-center gap-3 p-3.5 rounded-[14px] border border-border" style={{ background: cfg.bg }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cfg.color + "20" }}>
                            <FlaskConical size={16} style={{ color: cfg.color }} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold">Current Status</p>
                            <p className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</p>
                        </div>
                    </div>

                    {/* Test info */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Test Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Test Name", value: order.testName },
                                { label: "Category", value: order.testCategory },
                                { label: "Sample Type", value: order.sampleType },
                                { label: "Ordered By", value: order.doctorName },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-[12px] border border-border p-3 bg-muted/30">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                                    <p className="text-[13px] font-semibold text-foreground capitalize">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Patient */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Patient</p>
                        <div className="flex items-center gap-3 p-3.5 rounded-[14px] border border-border bg-muted/20">
                            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {order.patientName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">{order.patientName}</p>
                                <p className="text-xs text-muted-foreground font-medium">{order.patientUhid}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Timeline</p>
                        <div className="space-y-2">
                            {[
                                { label: "Ordered", time: order.orderedAt, done: true },
                                { label: "Sample Collected", time: order.collectedAt, done: !!order.collectedAt },
                                { label: "Result Ready", time: order.resultAt, done: !!order.resultAt },
                            ].map(({ label, time, done }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-emerald-100" : "bg-muted"}`}>
                                        {done ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Circle size={12} className="text-muted-foreground" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-semibold text-foreground">{label}</p>
                                        {time && <p className="text-[11px] text-muted-foreground">{fmtDate(time)}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Result */}
                    {order.result && (
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Result</p>
                            <div className="p-4 rounded-[14px] bg-emerald-50 border border-emerald-200">
                                <p className="text-sm text-emerald-800 font-semibold leading-relaxed">{order.result}</p>
                            </div>
                        </div>
                    )}

                    {order.notes && (
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Notes</p>
                            <div className="p-4 rounded-[14px] bg-muted/40 border border-border">
                                <p className="text-sm text-foreground font-medium">{order.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
const STATUS_FILTERS: { label: string; value: string }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

export default function LabPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

    const filtered = useMemo(() => {
        return DEMO_ORDERS.filter((o) => {
            const matchesSearch =
                !search ||
                o.patientName.toLowerCase().includes(search.toLowerCase()) ||
                o.testName.toLowerCase().includes(search.toLowerCase()) ||
                o.orderId.toLowerCase().includes(search.toLowerCase()) ||
                o.patientUhid.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    const stats = DEMO_STATS;

    const kpiCards = [
        { title: "Total Orders", value: stats.total, icon: TestTube2, color: "oklch(0.55 0.14 230)", bg: "oklch(0.55 0.14 230 / 0.10)" },
        { title: "Pending", value: stats.pending, icon: Clock, color: "oklch(0.65 0.18 40)", bg: "oklch(0.65 0.18 40 / 0.10)" },
        { title: "In Progress", value: stats.inProgress, icon: Microscope, color: "oklch(0.62 0.16 280)", bg: "oklch(0.62 0.16 280 / 0.10)" },
        { title: "Completed", value: stats.completed, icon: CheckCircle2, color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.10)" },
    ];

    return (
        <div className="space-y-7 animate-fade-in p-2">

            {/* ── Page Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "oklch(0.55 0.14 230 / 0.12)" }}>
                            <FlaskConical size={17} style={{ color: "oklch(0.55 0.14 230)" }} />
                        </div>
                        <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">Lab Orders</h1>
                    </div>
                    <p className="text-[14px] text-muted-foreground font-medium">Manage and track all laboratory test orders</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-white text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: "oklch(0.55 0.14 230)" }}>
                    <Plus size={15} /> New Order
                </button>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.title} className="stat-card bg-white group hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-[13px] flex items-center justify-center shadow-sm" style={{ background: card.bg }}>
                                    <Icon size={19} style={{ color: card.color }} />
                                </div>
                            </div>
                            <p className="font-display font-bold text-[26px] text-foreground tracking-tight leading-none mb-1">{card.value}</p>
                            <p className="text-[14px] font-semibold text-muted-foreground">{card.title}</p>
                            <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-300 ease-in-out rounded-b-[20px]" style={{ background: card.color }} />
                        </div>
                    );
                })}
            </div>

            {/* ── Filters ── */}
            <div className="bg-white rounded-[20px] border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by patient, test or order ID…"
                            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-[10px] border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-1.5 flex-wrap">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setStatusFilter(f.value)}
                                className={`px-3.5 py-2 rounded-[9px] text-xs font-bold transition-all ${statusFilter === f.value
                                    ? "text-white shadow-sm"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                                style={statusFilter === f.value ? { background: "oklch(0.55 0.14 230)" } : {}}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {["Order ID", "Patient", "Test", "Sample", "Doctor", "Ordered", "Status", ""].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm font-medium">
                                        <AlertCircle size={20} className="mx-auto mb-2 opacity-40" />
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order) => {
                                    const sampleClr = sampleBadgeColor(order.sampleType);
                                    return (
                                        <tr key={order.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedOrder(order)}>
                                            <td className="px-5 py-3.5">
                                                <span className="text-[13px] font-bold text-primary">{order.orderId}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div>
                                                    <p className="text-[13px] font-semibold text-foreground">{order.patientName}</p>
                                                    <p className="text-[11px] text-muted-foreground">{order.patientUhid}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div>
                                                    <p className="text-[13px] font-semibold text-foreground">{order.testName}</p>
                                                    <p className="text-[11px] text-muted-foreground">{order.testCategory}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide capitalize"
                                                    style={{ color: sampleClr.color, background: sampleClr.bg }}>
                                                    {order.sampleType}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-[13px] text-foreground font-medium">{order.doctorName}</p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-[12px] text-muted-foreground font-medium whitespace-nowrap">{fmtDate(order.orderedAt)}</p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                                                    <Eye size={14} className="text-muted-foreground" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
                    <p className="text-[12px] text-muted-foreground font-medium">
                        Showing <span className="font-bold text-foreground">{filtered.length}</span> of {DEMO_ORDERS.length} orders
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Clock size={12} />
                        Last updated: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedOrder && (
                <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
}
