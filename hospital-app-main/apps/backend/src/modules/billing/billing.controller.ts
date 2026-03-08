import { Request, Response } from "express";
import { getInvoices, getPayments } from "./billing.service";

/**
 * Handle GET /api/billing/invoices
 */
export async function getInvoicesController(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const invoices = await getInvoices({
            page: Number(page),
            limit: Number(limit),
            status: status as string | undefined,
        });

        res.json(invoices);
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
}

/**
 * Handle GET /api/billing/payments
 */
export async function getPaymentsController(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10, method } = req.query;

        const payments = await getPayments({
            page: Number(page),
            limit: Number(limit),
            method: method as string | undefined,
        });

        res.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: "Failed to fetch payments" });
    }
}
