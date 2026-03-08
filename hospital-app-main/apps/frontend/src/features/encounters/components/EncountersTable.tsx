"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { startConsultation } from "../api/encounter.api";
import { Encounter } from "../hooks/useEncounters";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

/* ======================================================
   PROPS
====================================================== */

interface EncountersTableProps {
  encounters: Encounter[];
  isLoading?: boolean;
}

/* ======================================================
   STATUS BADGE
====================================================== */

function StatusBadge({ status }: { status: Encounter["status"] }) {
  switch (status) {
    case "waiting":
      return <Badge variant="secondary">Waiting</Badge>;

    case "in_consultation":
      return <Badge variant="default">In Consultation</Badge>;

    case "completed":
      return <Badge variant="outline">Completed</Badge>;

    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;

    default:
      return null;
  }
}

/* ======================================================
   COMPONENT
====================================================== */

export function EncountersTable({
  encounters,
  isLoading,
}: EncountersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStartConsultation = async (encounterId: string) => {
    startTransition(async () => {
      try {
        await startConsultation(encounterId);

        router.push(`/dashboard/encounters/${encounterId}`);
      } catch (error) {
        console.error("Failed to start consultation", error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground py-8">
        Loading encounters...
      </div>
    );
  }

  if (!encounters.length) {
    return (
      <div className="text-sm text-muted-foreground py-8">
        No encounters found
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Chief Complaint</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {encounters.map((encounter) => (
            <TableRow key={encounter.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>
                    {encounter.patient.firstName} {encounter.patient.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {encounter.patient.uhid}
                  </span>
                </div>
              </TableCell>

              <TableCell>{encounter.chiefComplaint || "-"}</TableCell>

              <TableCell>{encounter.encounterType}</TableCell>

              <TableCell>
                <StatusBadge status={encounter.status} />
              </TableCell>

              <TableCell>
                {new Date(encounter.createdAt).toLocaleString()}
              </TableCell>

              <TableCell className="text-right">
                {encounter.status === "waiting" && (
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleStartConsultation(encounter.id)}
                  >
                    Start Consultation
                  </Button>
                )}

                {encounter.status === "in_consultation" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/encounters/${encounter.id}`)
                    }
                  >
                    Continue
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
