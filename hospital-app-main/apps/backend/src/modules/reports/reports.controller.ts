import { Request, Response } from "express";
import { getReportsKPIs } from "./reports.service";

/**
 * Handle GET /api/reports/kpis
 */
export async function getReportsKPIsController(req: Request, res: Response) {
    try {
        const data = await getReportsKPIs();
        res.json(data);
    } catch (error) {
        console.error("Error fetching report KPIs:", error);
        res.status(500).json({ error: "Failed to fetch report KPIs" });
    }
}
