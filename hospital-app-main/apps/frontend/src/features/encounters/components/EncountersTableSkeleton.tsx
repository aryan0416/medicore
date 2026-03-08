"use client";

import { Skeleton } from "@/components/ui/skeleton";

/* ======================================================
   SKELETON ROW
====================================================== */

function Row() {
  return (
    <tr className="border-t">
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-12" />
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16" />
      </td>

      <td className="px-4 py-3 text-right">
        <Skeleton className="h-8 w-16 ml-auto" />
      </td>
    </tr>
  );
}

/* ======================================================
   TABLE SKELETON
====================================================== */

export function EncountersTableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3">Encounter ID</th>
            <th className="text-left px-4 py-3">Patient</th>
            <th className="text-left px-4 py-3">Type</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Created</th>
            <th className="text-right px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          <Row />
          <Row />
          <Row />
          <Row />
          <Row />
        </tbody>
      </table>
    </div>
  );
}
