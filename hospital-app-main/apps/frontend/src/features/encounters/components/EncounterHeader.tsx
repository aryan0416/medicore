"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import type { EncounterDetail } from "../hooks/useEncounter";

/* ======================================================
   STATUS BADGE
====================================================== */

function StatusBadge({ status }: { status: EncounterDetail["status"] }) {
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

interface EncounterHeaderProps {
  encounter: EncounterDetail;
}

export function EncounterHeader({ encounter }: EncounterHeaderProps) {
  const patient = encounter.patient ?? {
    firstName: "Unknown",
    lastName: "",
    uhid: "-",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {patient.firstName} {patient.lastName}
            </span>

            <span className="text-sm text-muted-foreground">
              UHID: {patient.uhid}
            </span>
          </div>

          <StatusBadge status={encounter.status} />
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Encounter Type</span>
          <p>{encounter.encounterType}</p>
        </div>

        <div>
          <span className="text-muted-foreground">Created At</span>
          <p>{new Date(encounter.createdAt).toLocaleString()}</p>
        </div>

        <div className="col-span-2">
          <span className="text-muted-foreground">Chief Complaint</span>
          <p>{encounter.chiefComplaint || "-"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
