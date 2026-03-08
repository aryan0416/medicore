"use client";

import { useState, useMemo } from "react";
import {
    BedDouble, Users, CheckCircle2, Wrench,
    BookmarkCheck, TrendingUp, AlertCircle, Clock, Info,
    XCircle, Activity,
} from "lucide-react";
import { Bed, Ward, BedStatus } from "@/features/beds/beds.types";

/* ─────────────────────────────────────────────────────────
   DEMO DATA
───────────────────────────────────────────────────────── */
const DEMO_WARDS: Ward[] = [
    { id: "w1", name: "General Ward", type: "general", floor: 1, totalBeds: 20, occupiedBeds: 14, availableBeds: 6 },
    { id: "w2", name: "ICU", type: "icu", floor: 2, totalBeds: 10, occupiedBeds: 8, availableBeds: 1 },
    { id: "w3", name: "Emergency", type: "emergency", floor: 0, totalBeds: 8, occupiedBeds: 7, availableBeds: 1 },
    { id: "w4", name: "Maternity", type: "maternity", floor: 3, totalBeds: 12, occupiedBeds: 6, availableBeds: 6 },
    { id: "w5", name: "Paediatric", type: "pediatric", floor: 3, totalBeds: 10, occupiedBeds: 4, availableBeds: 6 },
];

function makeBeds(wardId: string, wardName: string, prefix: string, type: Bed["type"], count: number, occupiedNums: number[], maintenanceNums: number[] = [], patients: Record<number, Partial<Bed["patient"]>> = {}): Bed[] {
    return Array.from({ length: count }, (_, i) => {
        const num = i + 1;
        const isOccupied = occupiedNums.includes(num);
        const isMaintenance = maintenanceNums.includes(num);
        const status: BedStatus = isMaintenance ? "maintenance" : isOccupied ? "occupied" : "available";
        return {
            id: `${wardId}-${num}`,
            bedNumber: `${prefix}-${String(num).padStart(2, "0")}`,
            wardId,
            wardName,
            type,
            status,
            patient: isOccupied ? {
                patientId: `p${wardId}${num}`,
                patientName: patients[num]?.patientName ?? "Patient",
                patientUhid: patients[num]?.patientUhid ?? `UH-${1000 + num}`,
                admittedAt: patients[num]?.admittedAt ?? "2026-03-05T10:00:00Z",
                doctorName: patients[num]?.doctorName ?? "Dr. Rajesh Kumar",
                department: patients[num]?.department ?? "General Medicine",
                diagnosis: patients[num]?.diagnosis ?? "Under observation",
                expectedDischarge: patients[num]?.expectedDischarge,
            } : null,
        };
    });
}

const DEMO_BEDS: Record<string, Bed[]> = {
    w1: makeBeds("w1", "General Ward", "GW", "standard", 20, [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 15, 17, 18], [9], {
        1: { patientName: "Arjun Mehta", patientUhid: "UH-1001", doctorName: "Dr. Rajesh Kumar", department: "General Medicine", diagnosis: "Hypertension", admittedAt: "2026-03-05T08:00:00Z", expectedDischarge: "2026-03-09T00:00:00Z" },
        2: { patientName: "Priya Sharma", patientUhid: "UH-1002", doctorName: "Dr. Anita Desai", department: "Endocrinology", diagnosis: "Diabetes mellitus type 2", admittedAt: "2026-03-06T09:00:00Z" },
        3: { patientName: "Rajan Devi", patientUhid: "UH-1003", doctorName: "Dr. Vikram Singh", department: "Nephrology", diagnosis: "Urinary tract infection", admittedAt: "2026-03-07T07:00:00Z", expectedDischarge: "2026-03-10T00:00:00Z" },
    }),
    w2: makeBeds("w2", "ICU", "ICU", "icu", 10, [1, 2, 3, 4, 5, 6, 7, 8], [10], {
        1: { patientName: "Gopal Narayan", patientUhid: "UH-1006", doctorName: "Dr. Sonal Mehta", department: "Critical Care", diagnosis: "Acute respiratory failure", admittedAt: "2026-03-06T14:00:00Z" },
        2: { patientName: "Kavita Rao", patientUhid: "UH-1007", doctorName: "Dr. Vikram Singh", department: "Critical Care", diagnosis: "Post-operative monitoring", admittedAt: "2026-03-07T05:00:00Z" },
    }),
    w3: makeBeds("w3", "Emergency", "ER", "standard", 8, [1, 2, 3, 4, 5, 6, 7], [], {
        1: { patientName: "Dinesh Verma", patientUhid: "UH-1008", doctorName: "Dr. Rajesh Kumar", department: "Emergency", diagnosis: "Chest pain — under evaluation", admittedAt: "2026-03-07T11:30:00Z" },
    }),
    w4: makeBeds("w4", "Maternity", "MAT", "standard", 12, [1, 2, 3, 4, 7, 8], [5, 6], {
        1: { patientName: "Anjali Tiwari", patientUhid: "UH-1009", doctorName: "Dr. Sonal Mehta", department: "Obstetrics", diagnosis: "Post-delivery care", admittedAt: "2026-03-06T22:00:00Z", expectedDischarge: "2026-03-09T00:00:00Z" },
    }),
    w5: makeBeds("w5", "Paediatric", "PED", "standard", 10, [1, 2, 4, 5], [], {
        1: { patientName: "Aanya Patel", patientUhid: "UH-1020", doctorName: "Dr. Anita Desai", department: "Paediatrics", diagnosis: "Febrile seizure", admittedAt: "2026-03-07T08:30:00Z" },
    }),
};

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function bedStatusConfig(status: BedStatus) {
    switch (status) {
        case "available": return { label: "Available", color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.12)", border: "oklch(0.60 0.16 160 / 0.30)", dot: "bg-emerald-500" };
        case "occupied": return { label: "Occupied", color: "oklch(0.60 0.15 25)", bg: "oklch(0.60 0.15 25 / 0.08)", border: "oklch(0.60 0.15 25 / 0.30)", dot: "bg-red-500" };
        case "maintenance": return { label: "Maintenance", color: "oklch(0.55 0.10 60)", bg: "oklch(0.55 0.10 60 / 0.08)", border: "oklch(0.55 0.10 60 / 0.25)", dot: "bg-amber-500" };
        case "reserved": return { label: "Reserved", color: "oklch(0.55 0.14 230)", bg: "oklch(0.55 0.14 230 / 0.08)", border: "oklch(0.55 0.14 230 / 0.25)", dot: "bg-blue-500" };
    }
}

function fmtDate(iso?: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─────────────────────────────────────────────────────────
   BED CARD
───────────────────────────────────────────────────────── */
function BedCard({ bed, onClick }: { bed: Bed; onClick: (bed: Bed) => void }) {
    const cfg = bedStatusConfig(bed.status);
    return (
        <button
            onClick={() => onClick(bed)}
            disabled={bed.status === "maintenance"}
            className="relative flex flex-col items-center gap-1.5 p-3 rounded-[13px] border transition-all text-center hover:shadow-md active:scale-95 disabled:cursor-not-allowed"
            style={{ background: cfg.bg, borderColor: cfg.border }}
        >
            <BedDouble size={18} style={{ color: cfg.color }} />
            <span className="text-[11px] font-bold" style={{ color: cfg.color }}>{bed.bedNumber}</span>
            {bed.status === "occupied" && bed.patient && (
                <span className="text-[9px] font-semibold text-muted-foreground leading-tight max-w-[70px] truncate">
                    {bed.patient.patientName.split(" ")[0]}
                </span>
            )}
            {bed.status === "maintenance" && (
                <Wrench size={10} className="text-amber-500" />
            )}
            <span className={`w-2 h-2 rounded-full ${cfg.dot} ${bed.status === "occupied" ? "animate-pulse" : ""}`} />
        </button>
    );
}

/* ─────────────────────────────────────────────────────────
   BED DETAIL PANEL
───────────────────────────────────────────────────────── */
function BedDetailPanel({ bed, onClose }: { bed: Bed; onClose: () => void }) {
    const cfg = bedStatusConfig(bed.status);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
            <div
                className="w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col animate-fade-in overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{bed.wardName}</p>
                        <h3 className="font-display font-bold text-xl text-foreground mt-0.5">{bed.bedNumber}</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                        <XCircle size={16} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 p-3.5 rounded-[14px] border" style={{ background: cfg.bg, borderColor: cfg.border }}>
                        <span className={`w-3 h-3 rounded-full ${cfg.dot} ${bed.status === "occupied" ? "animate-pulse" : ""}`} />
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold">Bed Status</p>
                            <p className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</p>
                        </div>
                    </div>

                    {bed.status === "occupied" && bed.patient ? (
                        <div className="space-y-4">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Current Patient</p>

                            <div className="flex items-center gap-3 p-3.5 rounded-[14px] border border-border bg-muted/20">
                                <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {bed.patient.patientName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{bed.patient.patientName}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{bed.patient.patientUhid}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Doctor", value: bed.patient.doctorName },
                                    { label: "Department", value: bed.patient.department },
                                    { label: "Admitted", value: fmtDate(bed.patient.admittedAt) },
                                    { label: "Exp. Discharge", value: fmtDate(bed.patient.expectedDischarge) },
                                ].map(({ label, value }) => (
                                    <div key={label} className="rounded-[12px] border border-border p-3 bg-muted/30">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                                        <p className="text-[12px] font-semibold text-foreground">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-[12px] border border-border p-3 bg-muted/30">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Diagnosis</p>
                                <p className="text-[13px] font-semibold text-foreground">{bed.patient.diagnosis}</p>
                            </div>

                            <button className="w-full py-2.5 rounded-[12px] text-sm font-bold transition-all hover:opacity-90"
                                style={{ background: "oklch(0.60 0.15 25)", color: "white" }}>
                                Discharge Patient
                            </button>
                        </div>
                    ) : bed.status === "available" ? (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground font-medium">This bed is currently available for admission.</p>
                            <button className="w-full py-2.5 rounded-[12px] text-sm font-bold text-white transition-all hover:opacity-90"
                                style={{ background: "oklch(0.60 0.16 160)" }}>
                                Assign Patient
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 rounded-[14px] bg-amber-50 border border-amber-200">
                            <p className="text-sm text-amber-800 font-semibold">This bed is under maintenance and not available for assignment.</p>
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
export default function BedsPage() {
    const [activeWard, setActiveWard] = useState("w1");
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

    const allBeds = Object.values(DEMO_BEDS).flat();
    const totalBeds = allBeds.length;
    const occupied = allBeds.filter((b) => b.status === "occupied").length;
    const available = allBeds.filter((b) => b.status === "available").length;
    const maintenance = allBeds.filter((b) => b.status === "maintenance").length;
    const occupancyPct = Math.round((occupied / totalBeds) * 100);

    const wardBeds = DEMO_BEDS[activeWard] ?? [];
    const currentWard = DEMO_WARDS.find((w) => w.id === activeWard)!;

    const kpiCards = [
        { title: "Total Beds", value: totalBeds, icon: BedDouble, color: "oklch(0.55 0.14 230)", bg: "oklch(0.55 0.14 230 / 0.10)" },
        { title: "Occupied", value: occupied, icon: Users, color: "oklch(0.60 0.15 25)", bg: "oklch(0.60 0.15 25 / 0.10)" },
        { title: "Available", value: available, icon: CheckCircle2, color: "oklch(0.60 0.16 160)", bg: "oklch(0.60 0.16 160 / 0.10)" },
        { title: "Occupancy", value: `${occupancyPct}%`, icon: TrendingUp, color: "oklch(0.62 0.16 280)", bg: "oklch(0.62 0.16 280 / 0.10)" },
    ];

    return (
        <div className="space-y-7 animate-fade-in p-2">

            {/* ── Header ── */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "oklch(0.60 0.15 25 / 0.12)" }}>
                        <BedDouble size={17} style={{ color: "oklch(0.60 0.15 25)" }} />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">Bed Management</h1>
                </div>
                <p className="text-[14px] text-muted-foreground font-medium">Real-time ward and bed occupancy across all departments</p>
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

            {/* ── Ward Overview ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {DEMO_WARDS.map((ward) => {
                    const pct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
                    const isHigh = pct >= 80;
                    return (
                        <div key={ward.id} className="bg-white rounded-[18px] border border-border p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[13px] font-bold text-foreground">{ward.name}</p>
                                    <p className="text-[11px] text-muted-foreground capitalize">Floor {ward.floor} · {ward.type}</p>
                                </div>
                                <span className="text-[12px] font-bold" style={{ color: isHigh ? "oklch(0.60 0.15 25)" : "oklch(0.60 0.16 160)" }}>
                                    {pct}%
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%`, background: isHigh ? "oklch(0.60 0.15 25)" : "oklch(0.60 0.16 160)" }} />
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{ward.occupiedBeds} occupied</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{ward.availableBeds} free</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Ward Bed Grid ── */}
            <div className="bg-white rounded-[20px] border border-border shadow-sm">
                {/* Ward Tabs */}
                <div className="flex items-center gap-1 p-4 border-b border-border overflow-x-auto">
                    {DEMO_WARDS.map((ward) => (
                        <button key={ward.id} onClick={() => setActiveWard(ward.id)}
                            className={`px-4 py-2 rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-all ${activeWard === ward.id ? "text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                            style={activeWard === ward.id ? { background: "oklch(0.55 0.14 230)" } : {}}>
                            {ward.name}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {/* Legend */}
                    <div className="flex items-center gap-5 mb-5 flex-wrap">
                        <p className="text-[13px] font-bold text-foreground">{currentWard.name} — {wardBeds.length} beds</p>
                        <div className="flex gap-3 ml-auto">
                            {([
                                { label: "Available", dot: "bg-emerald-500" },
                                { label: "Occupied", dot: "bg-red-500" },
                                { label: "Maintenance", dot: "bg-amber-500" },
                            ] as const).map(({ label, dot }) => (
                                <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                    <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />{label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bed Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5">
                        {wardBeds.map((bed) => (
                            <BedCard key={bed.id} bed={bed} onClick={setSelectedBed} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedBed && (
                <BedDetailPanel bed={selectedBed} onClose={() => setSelectedBed(null)} />
            )}
        </div>
    );
}
