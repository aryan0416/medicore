import { pgTable, uuid, varchar, text, timestamp, pgEnum, numeric } from "drizzle-orm/pg-core";
import { patients } from "./patient.schema";
import { relations } from "drizzle-orm";

/* ======================================================
   COMMON TIMESTAMPS
====================================================================== */

const timestamps = {
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
};

/* ======================================================
   ENUMS
====================================================================== */

export const invoiceStatusEnum = pgEnum("invoice_status", ["Paid", "Pending", "Overdue"]);
export const paymentMethodEnum = pgEnum("payment_method", ["Credit Card", "Bank Transfer", "Cash", "Insurance"]);

/* ======================================================
   INVOICES
====================================================================== */

export const invoices = pgTable("invoices", {
    id: varchar("id", { length: 50 }).primaryKey(), // Using varchar for readable IDs like INV-2023-001
    patientId: uuid("patient_id")
        .notNull()
        .references(() => patients.id, { onDelete: "cascade" }),

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: invoiceStatusEnum("status").default("Pending").notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }),

    notes: text("notes"),

    ...timestamps,
});

/* ======================================================
   PAYMENTS
====================================================================== */

export const payments = pgTable("payments", {
    id: varchar("id", { length: 50 }).primaryKey(), // Using varchar for readable IDs like PAY-9382
    patientId: uuid("patient_id")
        .notNull()
        .references(() => patients.id, { onDelete: "cascade" }),
    invoiceId: varchar("invoice_id", { length: 50 })
        .references(() => invoices.id, { onDelete: "set null" }),

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    method: paymentMethodEnum("method").notNull(),
    reference: varchar("reference", { length: 150 }), // e.g Transaction ID

    notes: text("notes"),

    ...timestamps,
});

/* ======================================================
   RELATIONS
====================================================================== */

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    patient: one(patients, {
        fields: [invoices.patientId],
        references: [patients.id],
    }),
    payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    patient: one(patients, {
        fields: [payments.patientId],
        references: [patients.id],
    }),
    invoice: one(invoices, {
        fields: [payments.invoiceId],
        references: [invoices.id],
    }),
}));

/* ======================================================
   TYPES
====================================================================== */

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
