"use client";

import { useState, useMemo } from "react";
import {
    Pill, Search, CheckCircle2, XCircle, Package,
    AlertTriangle, Clock, Plus, Eye, ShoppingBag, Boxes,
    TrendingDown, AlertCircle,
} from "lucide-react";
import { Medicine, PharmacyDispense, DispenseStatus, StockStatus } from "@/features/pharmacy/pharmacy.types";

/* ─────────────────────────────────────────────────────────
   DEMO DATA
───────────────────────────────────────────────────────── */
const DEMO_QUEUE: PharmacyDispense[] = [
    { id: "1", dispenseId: "RX-0001", patientId: "p1", patientName: "Arjun Mehta", patientUhid: "UH-1001", doctorName: "Dr. Rajesh Kumar", medicineId: "m1", medicineName: "Amoxicillin 500mg", dosage: "500 mg", frequency: "TID", duration: "7 days", quantity: 21, status: "pending", prescribedAt: "2026-03-07T08:00:00Z" },
    { id: "2", dispenseId: "RX-0002", patientId: "p2", patientName: "Priya Sharma", patientUhid: "UH-1002", doctorName: "Dr. Anita Desai", medicineId: "m2", medicineName: "Metformin 500mg", dosage: "500 mg", frequency: "BD", duration: "30 days", quantity: 60, status: "pending", prescribedAt: "2026-03-07T07:30:00Z" },
    { id: "3", dispenseId: "RX-0003", patientId: "p3", patientName: "Rajan Devi", patientUhid: "UH-1003", doctorName: "Dr. Vikram Singh", medicineId: "m3", medicineName: "Pantoprazole 40mg", dosage: "40 mg", frequency: "OD", duration: "14 days", quantity: 14, status: "dispensed", prescribedAt: "2026-03-07T09:15:00Z", dispensedAt: "2026-03-07T09:50:00Z", dispensedBy: "Pharm. Nisha" },
    { id: "4", dispenseId: "RX-0004", patientId: "p4", patientName: "Suresh Patel", patientUhid: "UH-1004", doctorName: "Dr. Rajesh Kumar", medicineId: "m4", medicineName: "Atorvastatin 10mg", dosage: "10 mg", frequency: "OD", duration: "30 days", quantity: 30, status: "dispensed", prescribedAt: "2026-03-06T16:00:00Z", dispensedAt: "2026-03-06T16:30:00Z", dispensedBy: "Pharm. Ramesh" },
    { id: "5", dispenseId: "RX-0005", patientId: "p5", patientName: "Meena Joshi", patientUhid: "UH-1005", doctorName: "Dr. Sonal Mehta", medicineId: "m5", medicineName: "Levothyroxine 50mcg", dosage: "50 mcg", frequency: "OD", duration: "60 days", quantity: 60, status: "pending", prescribedAt: "2026-03-07T10:00:00Z" },
    { id: "6", dispenseId: "RX-0006", patientId: "p6", patientName: "Gopal Narayan", patientUhid: "UH-1006", doctorName: "Dr. Anita Desai", medicineId: "m6", medicineName: "Amlodipine 5mg", dosage: "5 mg", frequency: "OD", duration: "30 days", quantity: 30, status: "cancelled", prescribedAt: "2026-03-06T14:00:00Z", notes: "Patient allergic to CCBs — revised prescription" },
    { id: "7", dispenseId: "RX-0007", patientId: "p7", patientName: "Kavita Rao", patientUhid: "UH-1007", doctorName: "Dr. Vikram Singh", medicineId: "m7", medicineName: "Ceftriaxone 1g Inj", dosage: "1 g", frequency: "BD IV", duration: "5 days", quantity: 10, status: "pending", prescribedAt: "2026-03-07T11:00:00Z" },
];

const DEMO_INVENTORY: Medicine[] = [
    { id: "m1", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotics", form: "capsule", unit: "Capsule", currentStock: 1200, minStock: 200, price: 3.5, expiryDate: "2027-06-30", stockStatus: "ok" },
    { id: "m2", name: "Metformin 500mg", genericName: "Metformin HCl", category: "Antidiabetics", form: "tablet", unit: "Tablet", currentStock: 850, minStock: 300, price: 2.0, expiryDate: "2027-03-31", stockStatus: "ok" },
    { id: "m3", name: "Pantoprazole 40mg", genericName: "Pantoprazole Sodium", category: "GI", form: "tablet", unit: "Tablet", currentStock: 180, minStock: 200, price: 5.0, expiryDate: "2026-12-31", stockStatus: "low" },
    { id: "m4", name: "Atorvastatin 10mg", genericName: "Atorvastatin Calcium", category: "Statins", form: "tablet", unit: "Tablet", currentStock: 600, minStock: 100, price: 4.5, expiryDate: "2027-09-30", stockStatus: "ok" },
    { id: "m5", name: "Levothyroxine 50mcg", genericName: "Levothyroxine Sodium", category: "Thyroid", form: "tablet", unit: "Tablet", currentStock: 90, minStock: 200, price: 6.0, expiryDate: "2026-09-30", stockStatus: "critical" },
    { id: "m6", name: "Amlodipine 5mg", genericName: "Amlodipine Besylate", category: "Antihypertensives", form: "tablet", unit: "Tablet", currentStock: 0, minStock: 150, price: 3.0, expiryDate: "2027-01-31", stockStatus: "out_of_stock" },
    { id: "m7", name: "Ceftriaxone 1g Inj", genericName: "Ceftriaxone Sodium", category: "Antibiotics", form: "injection", unit: "Vial", currentStock: 45, minStock: 50, price: 85.0, expiryDate: "2026-11-30", stockStatus: "low" },
    { id: "m8", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesics", form: "tablet", unit: "Tablet", currentStock: 3200, minStock: 500, price: 1.0, expiryDate: "2027-12-31", stockStatus: "ok" },
    { id: "m9", name: "Salbutamol Inhaler", genericName: "Salbutamol Sulfate", category: "Bronchodilators", form: "inhaler", unit: "Inhaler", currentStock: 120, minStock: 30, price: 145.0, expiryDate: "2027-04-30", stockStatus: "ok" },
    { id: "m10", name: "Insulin Glargine", genericName: "Insulin Glargine", category: "Antidiabetics", form: "injection", unit: "Pen", currentStock: 12, minStock: 20, price: 890.0, expiryDate: "2026-08-31", stockStatus: "critical" },
];

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function dispenseConfig(status: DispenseStatus) {
    switch (status) {
        case "pending": return { label: "Pending", color: "oklch(0.65 0.18 40)", bg: "oklch(0.65 0.18 40 / 0.10)" };
        case "dispensed": return { label: "Dispensed", color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.10)" };
        case "cancelled": return { label: "Cancelled", color: "oklch(0.60 0.15 25)", bg: "oklch(0.60 0.15 25 / 0.10)" };
    }
}

function stockConfig(status: StockStatus) {
    switch (status) {
        case "ok": return { label: "In Stock", color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.10)" };
        case "low": return { label: "Low Stock", color: "oklch(0.65 0.18 40)", bg: "oklch(0.65 0.18 40 / 0.10)" };
        case "critical": return { label: "Critical", color: "oklch(0.60 0.15 25)", bg: "oklch(0.60 0.15 25 / 0.10)" };
        case "out_of_stock": return { label: "Out of Stock", color: "oklch(0.50 0.20 25)", bg: "oklch(0.50 0.20 25 / 0.12)" };
    }
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
type Tab = "queue" | "inventory";

export default function PharmacyPage() {
    const [activeTab, setActiveTab] = useState<Tab>("queue");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const pendingCount = DEMO_QUEUE.filter((d) => d.status === "pending").length;
    const lowStockCount = DEMO_INVENTORY.filter((m) => m.stockStatus === "low" || m.stockStatus === "critical" || m.stockStatus === "out_of_stock").length;

    const filteredQueue = useMemo(() => DEMO_QUEUE.filter((d) => {
        const matchSearch = !search || d.patientName.toLowerCase().includes(search.toLowerCase()) || d.medicineName.toLowerCase().includes(search.toLowerCase()) || d.dispenseId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || d.status === statusFilter;
        return matchSearch && matchStatus;
    }), [search, statusFilter]);

    const filteredInventory = useMemo(() => DEMO_INVENTORY.filter((m) => {
        return !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase());
    }), [search]);

    const kpiCards = [
        { title: "Total Medicines", value: DEMO_INVENTORY.length, icon: Pill, color: "oklch(0.62 0.16 280)", bg: "oklch(0.62 0.16 280 / 0.10)" },
        { title: "Low / Critical", value: lowStockCount, icon: AlertTriangle, color: "oklch(0.65 0.18 40)", bg: "oklch(0.65 0.18 40 / 0.10)" },
        { title: "Today's Dispenses", value: DEMO_QUEUE.filter((d) => d.status === "dispensed").length, icon: CheckCircle2, color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.10)" },
        { title: "Pending Prescriptions", value: pendingCount, icon: Clock, color: "oklch(0.55 0.14 230)", bg: "oklch(0.55 0.14 230 / 0.10)" },
    ];

    return (
        <div className="space-y-7 animate-fade-in p-2">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "oklch(0.62 0.16 280 / 0.12)" }}>
                            <Pill size={17} style={{ color: "oklch(0.62 0.16 280)" }} />
                        </div>
                        <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">Pharmacy</h1>
                    </div>
                    <p className="text-[14px] text-muted-foreground font-medium">Manage prescriptions, dispense queue, and medicine inventory</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-white text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: "oklch(0.62 0.16 280)" }}>
                    <Plus size={15} /> Add Medicine
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

            {/* ── Main Card ── */}
            <div className="bg-white rounded-[20px] border border-border shadow-sm">

                {/* Tab Bar + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-border">
                    <div className="flex gap-1 bg-muted rounded-[11px] p-1">
                        {([
                            { key: "queue", label: "Dispense Queue", icon: ShoppingBag },
                            { key: "inventory", label: "Inventory", icon: Boxes },
                        ] as const).map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => { setActiveTab(key); setSearch(""); setStatusFilter("all"); }}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[13px] font-bold transition-all ${activeTab === key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <Icon size={14} />
                                {label}
                                {key === "queue" && pendingCount > 0 && (
                                    <span className="ml-0.5 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
                                        style={{ background: "oklch(0.65 0.18 40)" }}>{pendingCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 flex-1 sm:justify-end">
                        <div className="relative flex-1 sm:max-w-[280px]">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={activeTab === "queue" ? "Search prescriptions…" : "Search medicines…"}
                                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-[10px] border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        {activeTab === "queue" && (
                            <div className="flex gap-1">
                                {(["all", "pending", "dispensed", "cancelled"] as const).map((s) => (
                                    <button key={s} onClick={() => setStatusFilter(s)}
                                        className={`px-3 py-2 rounded-[9px] text-xs font-bold transition-all capitalize whitespace-nowrap ${statusFilter === s ? "text-white" : "bg-muted text-muted-foreground"}`}
                                        style={statusFilter === s ? { background: "oklch(0.62 0.16 280)" } : {}}>
                                        {s === "all" ? "All" : s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Dispense Queue Tab ── */}
                {activeTab === "queue" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    {["Rx ID", "Patient", "Medicine", "Dose / Freq", "Qty", "Doctor", "Prescribed", "Status", ""].map((h) => (
                                        <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQueue.length === 0 ? (
                                    <tr><td colSpan={9} className="px-5 py-12 text-center text-muted-foreground text-sm font-medium">
                                        <AlertCircle size={20} className="mx-auto mb-2 opacity-40" />No prescriptions found.
                                    </td></tr>
                                ) : filteredQueue.map((d) => {
                                    const cfg = dispenseConfig(d.status);
                                    return (
                                        <tr key={d.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors group">
                                            <td className="px-5 py-3.5"><span className="text-[13px] font-bold text-primary">{d.dispenseId}</span></td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-[13px] font-semibold text-foreground">{d.patientName}</p>
                                                <p className="text-[11px] text-muted-foreground">{d.patientUhid}</p>
                                            </td>
                                            <td className="px-5 py-3.5"><p className="text-[13px] font-semibold text-foreground">{d.medicineName}</p></td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-[12px] text-foreground font-medium">{d.dosage} · {d.frequency}</p>
                                                <p className="text-[11px] text-muted-foreground">{d.duration}</p>
                                            </td>
                                            <td className="px-5 py-3.5"><span className="text-[13px] font-bold text-foreground">{d.quantity}</span></td>
                                            <td className="px-5 py-3.5"><p className="text-[12px] text-foreground font-medium">{d.doctorName}</p></td>
                                            <td className="px-5 py-3.5"><p className="text-[12px] text-muted-foreground font-medium whitespace-nowrap">{fmtDate(d.prescribedAt)}</p></td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide"
                                                    style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {d.status === "pending" && (
                                                    <button className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white transition-all hover:opacity-90 whitespace-nowrap"
                                                        style={{ background: "oklch(0.60 0.16 160)" }}>
                                                        Dispense
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Inventory Tab ── */}
                {activeTab === "inventory" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    {["Medicine", "Generic Name", "Category", "Form", "Current Stock", "Min. Stock", "Price", "Expiry", "Status"].map((h) => (
                                        <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.length === 0 ? (
                                    <tr><td colSpan={9} className="px-5 py-12 text-center text-muted-foreground text-sm font-medium">
                                        <AlertCircle size={20} className="mx-auto mb-2 opacity-40" />No medicines found.
                                    </td></tr>
                                ) : filteredInventory.map((m) => {
                                    const stockCfg = stockConfig(m.stockStatus);
                                    const pct = Math.min(100, Math.round((m.currentStock / (m.minStock * 3)) * 100));
                                    const isLow = m.stockStatus !== "ok";
                                    return (
                                        <tr key={m.id} className={`border-b border-border/60 hover:bg-muted/30 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    {isLow && <AlertTriangle size={13} style={{ color: stockCfg.color }} />}
                                                    <p className="text-[13px] font-semibold text-foreground">{m.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5"><p className="text-[12px] text-muted-foreground font-medium">{m.genericName}</p></td>
                                            <td className="px-5 py-3.5"><p className="text-[12px] text-foreground font-medium">{m.category}</p></td>
                                            <td className="px-5 py-3.5"><p className="text-[12px] text-muted-foreground capitalize">{m.form}</p></td>
                                            <td className="px-5 py-3.5">
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-bold" style={{ color: isLow ? stockCfg.color : "inherit" }}>
                                                        {m.currentStock.toLocaleString()} {m.unit}s
                                                    </p>
                                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: isLow ? stockCfg.color : "oklch(0.60 0.16 160)" }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5"><p className="text-[12px] text-muted-foreground">{m.minStock.toLocaleString()}</p></td>
                                            <td className="px-5 py-3.5"><p className="text-[13px] font-semibold text-foreground">₹{m.price.toFixed(2)}</p></td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-[12px] text-muted-foreground whitespace-nowrap">
                                                    {new Date(m.expiryDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap"
                                                    style={{ color: stockCfg.color, background: stockCfg.bg }}>{stockCfg.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
                    <p className="text-[12px] text-muted-foreground font-medium">
                        {activeTab === "queue"
                            ? <><span className="font-bold text-foreground">{filteredQueue.length}</span> prescriptions</>
                            : <><span className="font-bold text-foreground">{filteredInventory.length}</span> medicines</>}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Clock size={12} />
                        Last updated: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>
            </div>
        </div>
    );
}
