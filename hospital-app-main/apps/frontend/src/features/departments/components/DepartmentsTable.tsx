"use client";

import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDeleteDepartment } from "../hooks/useDeleteDepartment";

import { usePermissions } from "@/providers/PermissionProvider";

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

interface Props {
  departments: Department[];
}

export function DepartmentsTable({ departments }: Props) {
  const { mutate } = useDeleteDepartment();

  const permissions = usePermissions();

  const canDelete = permissions.includes("department.delete");

  function handleDelete(id: string) {
    if (!confirm("Delete this department?")) return;

    mutate(id);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {departments.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell className="font-medium">{dept.name}</TableCell>

            <TableCell>{dept.code}</TableCell>

            <TableCell className="max-w-[300px] truncate">
              {dept.description || "-"}
            </TableCell>

            <TableCell className="flex gap-2">
              {/* VIEW */}

              <Link href={`/dashboard/admin/departments/${dept.id}`}>
                <Button size="icon" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>

              {/* DELETE */}

              {canDelete && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(dept.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
