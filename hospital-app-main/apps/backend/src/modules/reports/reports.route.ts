import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getReportsKPIsController } from "./reports.controller";

const router = Router();

// Secure all reports routes
router.use(authenticate);

// Maps to /api/reports/kpis
router.get("/kpis", getReportsKPIsController);

export default router;
