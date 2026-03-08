import { db } from "../../db";
import { invoices, payments } from "../../db/schema/billing.schema";
import { patients } from "../../db/schema/patient.schema";
import { eq, desc, sql, count } from "drizzle-orm";

interface FetchParams {
    page: number;
    limit: number;
    status?: string;
    method?: string;
}

export async function getInvoices({ page, limit, status }: FetchParams) {
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = status ? eq(invoices.status, status as any) : undefined;

    // Get total count for pagination
    const [{ total }] = await db
        .select({ total: count() })
        .from(invoices)
        .where(whereClause);

    // Fetch paginated data joined with patient names
    const data = await db
        .select({
            id: invoices.id,
            patientName: sql<string>`concat(${patients.firstName}, ' ', ${patients.lastName})`,
            date: sql<string>`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`,
            amount: invoices.amount,
            status: invoices.status,
            dueDate: sql<string>`to_char(${invoices.dueDate}, 'YYYY-MM-DD')`,
        })
        .from(invoices)
        .leftJoin(patients, eq(invoices.patientId, patients.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(invoices.createdAt));

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getPayments({ page, limit, method }: FetchParams) {
    const offset = (page - 1) * limit;

    const whereClause = method ? eq(payments.method, method as any) : undefined;

    const [{ total }] = await db
        .select({ total: count() })
        .from(payments)
        .where(whereClause);

    const data = await db
        .select({
            id: payments.id,
            patientName: sql<string>`concat(${patients.firstName}, ' ', ${patients.lastName})`,
            date: sql<string>`to_char(${payments.createdAt}, 'YYYY-MM-DD')`,
            amount: payments.amount,
            method: payments.method,
            reference: payments.reference,
        })
        .from(payments)
        .leftJoin(patients, eq(payments.patientId, patients.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(payments.createdAt));

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
