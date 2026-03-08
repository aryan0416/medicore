"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, UserPlus, Search } from "lucide-react";
import { usePatients } from "@/features/patients/hooks/usePatients";
import { PatientsTable } from "@/features/patients/components/PatientsTable";
import { PatientTableSkeleton } from "@/features/patients/components/PatientsTableSkeleton";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/providers/PermissionProvider";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const permissions = usePermissions();
  const canCreate = permissions.includes("patient.create");

  const { data, isLoading } = usePatients({ search, page, limit: 10 });

  return (
    <div className="space-y-6 animate-fade-in px-2 lg:px-4 py-4">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm"
            style={{ background: "oklch(0.60 0.16 160 / 0.15)" }} // Emerald light bg
          >
            <Users size={24} style={{ color: "oklch(0.60 0.16 160)" }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">Patients</h1>
            <p className="text-[14px] font-medium text-muted-foreground mt-0.5">
              {data ? `${data.pagination.total ?? data.data.length} records found` : "Loading records..."}
            </p>
          </div>
        </div>

        {canCreate && (
          <Link href="/dashboard/patients/new">
            <Button
              className="flex items-center gap-2 rounded-xl h-11 px-5 text-[15px] font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 gradient-teal"
            >
              <UserPlus size={16} />
              Add Patient
            </Button>
          </Link>
        )}
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, UHID, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none shadow-sm transition-all hover:border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* ── Content ── */}
      <div className="rounded-[20px] border border-border bg-white shadow-sm overflow-hidden flex flex-col">
        {isLoading && <PatientTableSkeleton />}

        {data && data.data.length > 0 && (
          <>
            <PatientsTable patients={data.data} />
            <div className="px-6 py-4 border-t border-border bg-muted/20">
              <PaginationControls
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {data && data.data.length === 0 && (
          <div className="p-12">
            <EmptyState
              title="No patients found"
              description="Try adjusting your search or create a new patient."
              actionLabel={canCreate ? "Create Patient" : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
