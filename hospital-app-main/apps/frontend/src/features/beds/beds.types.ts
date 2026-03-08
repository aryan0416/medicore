/* ======================================================
   BEDS TYPES
====================================================== */

export type BedStatus = "available" | "occupied" | "maintenance" | "reserved";

export type WardType = "general" | "icu" | "emergency" | "maternity" | "pediatric" | "surgery";

export interface Ward {
    id: string;
    name: string;
    type: WardType;
    floor: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
}

export interface BedPatientInfo {
    patientId: string;
    patientName: string;
    patientUhid: string;
    admittedAt: string;
    doctorName: string;
    department: string;
    diagnosis: string;
    expectedDischarge?: string | null;
}

export interface Bed {
    id: string;
    bedNumber: string;
    wardId: string;
    wardName: string;
    type: "standard" | "icu" | "isolation" | "premium";
    status: BedStatus;
    patient?: BedPatientInfo | null;
    notes?: string | null;
}

export interface BedStats {
    totalBeds: number;
    occupied: number;
    available: number;
    maintenance: number;
    reserved: number;
    occupancyPct: number;
}
