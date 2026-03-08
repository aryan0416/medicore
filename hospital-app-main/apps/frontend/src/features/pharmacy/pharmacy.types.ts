/* ======================================================
   PHARMACY TYPES
====================================================== */

export type DispenseStatus = "pending" | "dispensed" | "cancelled";

export type StockStatus = "ok" | "low" | "critical" | "out_of_stock";

export interface Medicine {
    id: string;
    name: string;
    genericName: string;
    category: string;
    form: "tablet" | "capsule" | "syrup" | "injection" | "cream" | "drops" | "inhaler";
    unit: string;
    currentStock: number;
    minStock: number;
    price: number;
    expiryDate: string;
    stockStatus: StockStatus;
}

export interface PharmacyDispense {
    id: string;
    dispenseId: string;
    patientId: string;
    patientName: string;
    patientUhid: string;
    doctorName: string;
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    status: DispenseStatus;
    prescribedAt: string;
    dispensedAt?: string | null;
    dispensedBy?: string | null;
    notes?: string | null;
}

export interface PharmacyStats {
    totalMedicines: number;
    lowStockCount: number;
    outOfStockCount: number;
    todayDispenses: number;
    pendingDispenses: number;
}
