/* ======================================================
   LAB TYPES
====================================================== */

export type LabOrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type SampleType = "blood" | "urine" | "stool" | "swab" | "tissue" | "other";

export interface LabTest {
    id: string;
    name: string;
    category: string;
    sampleType: SampleType;
    turnaroundHours: number;
    price: number;
}

export interface LabOrder {
    id: string;
    orderId: string;
    patientId: string;
    patientName: string;
    patientUhid: string;
    doctorName: string;
    testId: string;
    testName: string;
    testCategory: string;
    sampleType: SampleType;
    status: LabOrderStatus;
    orderedAt: string;
    collectedAt?: string | null;
    resultAt?: string | null;
    result?: string | null;
    notes?: string | null;
}

export interface LabStats {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}
