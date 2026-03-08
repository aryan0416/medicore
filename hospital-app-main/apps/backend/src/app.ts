import express from "express";
import cors from "cors";
import helmet from "helmet";

import { authenticate } from "./middleware/auth.middleware";
import { requirePermission } from "./middleware/permission.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

import patientRoute from "./modules/patient/patient.route";
import departmentRoute from "./modules/departments/departments.route";
import adminUsersRoute from "./modules/admin-users/admin-users.route";
import encounterRoute from "./modules/encounter/encounter.route";
import aiRoute from "./modules/ai/ai.route";
import billingRoute from "./modules/billing/billing.route";
import reportsRoute from "./modules/reports/reports.route";

const app = express();

/* ======================================================
   Core Middleware
====================================================== */

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());

/* ======================================================
   Health Check
====================================================== */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ======================================================
   API Routes
====================================================== */

app.use("/api/patients", patientRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/encounters", encounterRoute);
app.use("/api/admin/users", adminUsersRoute);
app.use("/api/ai", aiRoute);
app.use("/api/billing", billingRoute);
app.use("/api/reports", reportsRoute);

/* ======================================================
   Dev/Test Routes
====================================================== */

if (process.env.NODE_ENV !== "production") {
  app.get(
    "/api/test",
    authenticate,
    requirePermission("patient.read"),
    (req, res) => {
      res.json({
        message: "Backend RBAC working",
        user: (req as any).user,
      });
    },
  );

  app.get("/protected", authenticate, (req, res) => {
    res.json({
      message: "You are authenticated",
      user: (req as any).user,
    });
  });

  app.get(
    "/test-patient-create",
    authenticate,
    requirePermission("patient.create"),
    (_req, res) => {
      res.json({
        message: "You have patient.create permission",
      });
    },
  );
}

/* ======================================================
   404 Handler
====================================================== */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ======================================================
   Global Error Middleware
====================================================== */

app.use(errorMiddleware);

export default app;
