"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminUsers } from "@/features/admin-users/hooks/useAdminUsers";

import { AdminUsersTable } from "@/features/admin-users/components/AdminUsersTable";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminUsersTableSkeleton } from "@/features/admin-users/components/AdminUsersTableSkeleton";

import { usePermissions } from "@/providers/PermissionProvider";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const permissions = usePermissions();
  const canCreate = permissions.includes("admin.user.update");

  const { data, isLoading } = useAdminUsers({
    search,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        {canCreate && (
          <Link href="/dashboard/admin/users/new">
            <Button>Create User</Button>
          </Link>
        )}
      </div>

      {/* SEARCH */}

      <Input
        placeholder="Search by email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      {/* LOADING */}

      {isLoading && <AdminUsersTableSkeleton />}

      {/* DATA */}

      {data && data.data.length > 0 && (
        <>
          <AdminUsersTable users={data.data} />

          <PaginationControls
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* EMPTY */}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No users found"
          description="No staff members match your search."
        />
      )}
    </div>
  );
}
