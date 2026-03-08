import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

async function fetchReportsKpis() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/kpis`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch report KPIs');
    }
    return res.json();
}

export function useReports() {
    return useQuery({
        queryKey: ["reports-kpis"],
        queryFn: fetchReportsKpis,
        refetchInterval: 300000, // Refresh every 5 minutes automatically
    });
}
