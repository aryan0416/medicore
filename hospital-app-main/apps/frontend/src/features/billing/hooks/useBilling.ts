import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

async function fetchFromApi(endpoint: string) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint} `, {
        headers: {
            Authorization: `Bearer ${token} `
        }
    });

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export function useBillingInvoices(page = 1, limit = 10, status?: string) {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status ? { status } : {})
    });

    return useQuery({
        queryKey: ["billing-invoices", page, limit, status],
        queryFn: () => fetchFromApi(`/ api / billing / invoices ? ${queryParams} `)
    });
}

export function useBillingPayments(page = 1, limit = 10, method?: string) {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(method ? { method } : {})
    });

    return useQuery({
        queryKey: ["billing-payments", page, limit, method],
        queryFn: () => fetchFromApi(`/ api / billing / payments ? ${queryParams} `)
    });
}
