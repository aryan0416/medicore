import { db } from "../index";
import { roles, permissions, rolePermissions } from "../schema";

/* ============================================================
   ROLE DEFINITIONS
============================================================ */

const ROLE_LIST = [
  "SuperAdmin",
  "Admin",
  "Doctor",
  "Nurse",
  "Lab",
  "Pharmacy",
  "Billing",
  "Reception",
];

/* ============================================================
   PERMISSION DEFINITIONS
============================================================ */

const PERMISSIONS = [
  /* ================= PATIENT ================= */

  "patient.create",
  "patient.read",
  "patient.update",
  "patient.delete",

  /* ================= ENCOUNTER ================= */

  "encounter.create",
  "encounter.read",
  "encounter.update",
  "encounter.discharge",

  /* ================= LAB ================= */

  "lab.order",
  "lab.read",
  "lab.update",
  "lab.cancel",

  /* ================= PHARMACY ================= */

  "pharmacy.read",
  "pharmacy.dispense",
  "pharmacy.manage",
  "pharmacy.adjust",

  /* ================= BILLING ================= */

  "billing.create",
  "billing.update",
  "billing.finalize",
  "billing.pay",
  "billing.read",

  /* ================= BED ================= */

  "bed.read",
  "bed.assign",
  "bed.transfer",
  "bed.release",
  "bed.manage",

  /* ================= REPORTS ================= */

  "reports.read",
  "reports.export",

  /* ================= LOGS ================= */

  "logs.read",

  /* ================= DEPARTMENTS ================= */

  "department.create",
  "department.read",
  "department.update",
  "department.delete",

  /* ================= ADMIN USERS ================= */

  "admin.user.read",
  "admin.user.update",
  "admin.user.assign-role",
  "admin.user.assign-department",
  "admin.user.activate",
  "admin.user.deactivate",

  /* ================= SYSTEM ================= */

  "settings.manage",
  "rbac.manage",
];

/* ============================================================
   ROLE → PERMISSION MAP
============================================================ */

const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  /* =========================================================
     SUPER ADMIN
  ========================================================= */

  SuperAdmin: PERMISSIONS,

  /* =========================================================
     ADMIN
  ========================================================= */

  Admin: [
    "patient.read",
    "patient.update",

    "encounter.read",

    "billing.read",

    "reports.read",
    "logs.read",

    "department.create",
    "department.read",
    "department.update",

    "admin.user.read",
    "admin.user.update",
    "admin.user.assign-role",
    "admin.user.assign-department",
    "admin.user.activate",
    "admin.user.deactivate",
  ],

  /* =========================================================
     DOCTOR
  ========================================================= */

  Doctor: [
    "patient.read",

    "encounter.create",
    "encounter.read",
    "encounter.update",

    "lab.order",
    "lab.read",
  ],

  /* =========================================================
     NURSE
  ========================================================= */

  Nurse: ["patient.read", "encounter.read", "bed.read"],

  /* =========================================================
     LAB
  ========================================================= */

  Lab: ["lab.read", "lab.update", "lab.cancel"],

  /* =========================================================
     PHARMACY
  ========================================================= */

  Pharmacy: ["pharmacy.read", "pharmacy.dispense", "pharmacy.manage"],

  /* =========================================================
     BILLING
  ========================================================= */

  Billing: [
    "billing.create",
    "billing.update",
    "billing.finalize",
    "billing.pay",
    "billing.read",
  ],

  /* =========================================================
     RECEPTION
  ========================================================= */

  Reception: [
    "patient.create",
    "patient.read",

    "encounter.create",
    "encounter.read",
  ],
};

/* ============================================================
   SEED EXECUTION
============================================================ */

async function seed() {
  console.log("🌱 Seeding RBAC...");

  /* ================= CREATE ROLES ================= */

  for (const roleName of ROLE_LIST) {
    await db.insert(roles).values({ name: roleName }).onConflictDoNothing();
  }

  /* ================= CREATE PERMISSIONS ================= */

  for (const code of PERMISSIONS) {
    await db
      .insert(permissions)
      .values({
        code,
        description: code,
      })
      .onConflictDoNothing();
  }

  /* ================= FETCH DB DATA ================= */

  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);

  const roleMap = Object.fromEntries(allRoles.map((r) => [r.name, r.id]));

  const permissionMap = Object.fromEntries(
    allPermissions.map((p) => [p.code, p.id]),
  );

  /* ================= ROLE → PERMISSION ================= */

  for (const roleName in ROLE_PERMISSION_MAP) {
    const roleId = roleMap[roleName];
    const permissionCodes = ROLE_PERMISSION_MAP[roleName];

    for (const code of permissionCodes) {
      const permissionId = permissionMap[code];

      if (!permissionId) continue;

      await db
        .insert(rolePermissions)
        .values({
          roleId,
          permissionId,
        })
        .onConflictDoNothing();
    }
  }

  console.log("✅ RBAC Seeding Complete");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ RBAC Seed Failed:", err);
  process.exit(1);
});
