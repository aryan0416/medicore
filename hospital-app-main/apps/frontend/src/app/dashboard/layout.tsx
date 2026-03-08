import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PermissionProvider } from "@/providers/PermissionProvider";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // Get user and session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Fetch RBAC data directly from the signed Supabase JWT custom claims!
  // This requires zero database lookups because our Postgres triggers sync the rows into the token immediately.
  const permissions = user?.app_metadata?.permissions || [];
  const roles = user?.app_metadata?.roles || [];
  const primaryRole = roles[0] || "";

  return (
    <PermissionProvider permissions={permissions} role={primaryRole}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar role={primaryRole} permissions={permissions} />

        {/* Main Area */}
        <div className="flex flex-col flex-1">
          <Header user={user} role={primaryRole} />

          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </PermissionProvider>
  );
}
