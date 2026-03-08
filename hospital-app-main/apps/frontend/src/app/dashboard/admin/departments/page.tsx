"use client";

import { useState } from "react";
import Link from "next/link";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

import { DepartmentsTable } from "@/features/departments/components/DepartmentsTable";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DepartmentsTableSkeleton } from "@/features/departments/components/DepartmentsTableSkeleton";

import { usePermissions } from "@/providers/PermissionProvider";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const permissions = usePermissions();
  const canCreate = permissions.includes("department.create");

  const { data, isLoading } = useDepartments({
    search,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Departments</h1>

        {canCreate && (
          <Link href="/dashboard/admin/departments/new">
            <Button>Create Department</Button>
          </Link>
        )}
      </div>

      {/* Search */}

      <Input
        placeholder="Search departments..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      {/* Loading */}

      {isLoading && <DepartmentsTableSkeleton />}

      {/* Data */}

      {data && data.data.length > 0 && (
        <>
          <DepartmentsTable departments={data.data} />

          <PaginationControls
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Empty */}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No departments found"
          description="Create departments to organize hospital services."
          actionLabel={canCreate ? "Create Department" : undefined}
          onAction={canCreate ? () => window.location.href = "/dashboard/admin/departments/new" : undefined}
        />
      )}
    </div>
  );
}
