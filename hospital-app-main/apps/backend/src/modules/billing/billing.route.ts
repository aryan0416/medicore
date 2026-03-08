import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getInvoicesController, getPaymentsController } from "./billing.controller";
// In a fully production system we would create a `requirePermission("billing.read")` middleware check here!

const router = Router();

// Secure all billing routes with standard authentication
router.use(authenticate);

// Maps to /api/billing/invoices
router.get("/invoices", getInvoicesController);

// Maps to /api/billing/payments
router.get("/payments", getPaymentsController);

export default router;
