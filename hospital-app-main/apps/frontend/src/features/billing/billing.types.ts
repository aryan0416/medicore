export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
export type PaymentMethod = "Credit Card" | "Bank Transfer" | "Cash" | "Insurance";

export interface Invoice {
    id: string;
    patientName: string;
    date: string;
    amount: number;
    status: InvoiceStatus;
    dueDate: string;
}

export interface Payment {
    id: string;
    patientName: string;
    date: string;
    amount: number;
    method: PaymentMethod;
    reference: string;
}
