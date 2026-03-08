"use client";

import { useState } from "react";

import type { AdminUser } from "../adminUser.types";

import {
  assignUserDepartment,
  assignUserRole,
  updateUserStatus,
} from "../api/adminUsers.api";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/providers/PermissionProvider";

interface Props {
  users: AdminUser[];
}

export function AdminUsersTable({ users }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const permissions = usePermissions();

  const canUpdate = permissions.includes("admin.user.update");

  async function toggleStatus(user: AdminUser) {
    try {
      setLoadingId(user.id);

      await updateUserStatus(user.id, {
        isActive: user.isActive === "true" ? "false" : "true",
      });

      location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  async function assignDepartment(userId: string) {
    const departmentId = prompt("Enter department UUID");

    if (!departmentId) return;

    try {
      setLoadingId(userId);

      await assignUserDepartment(userId, {
        departmentId,
      });

      location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  async function assignRole(userId: string) {
    const roleId = prompt("Enter role UUID");

    if (!roleId) return;

    try {
      setLoadingId(userId);

      await assignUserRole(userId, {
        roleId,
      });

      location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Department</th>
            <th className="text-left p-3">Status</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              {/* NAME */}

              <td className="p-3">
                {user.fullName ?? (
                  <span className="text-muted-foreground">No name</span>
                )}
              </td>

              {/* EMAIL */}

              <td className="p-3 font-mono text-xs">{user.email}</td>

              {/* DEPARTMENT */}

              <td className="p-3 text-muted-foreground">
                {user.departmentName ?? "-"}
              </td>

              {/* STATUS */}

              <td className="p-3">
                {user.isActive === "true" ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </td>

              {/* ACTIONS */}

              <td className="p-3 text-right space-x-2">
                {canUpdate && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingId === user.id}
                      onClick={() => assignDepartment(user.id)}
                    >
                      Department
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingId === user.id}
                      onClick={() => assignRole(user.id)}
                    >
                      Role
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={loadingId === user.id}
                      onClick={() => toggleStatus(user)}
                    >
                      {user.isActive === "true" ? "Deactivate" : "Activate"}
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
