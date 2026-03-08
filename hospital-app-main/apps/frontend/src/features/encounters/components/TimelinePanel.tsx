"use client";

import { formatDateTime } from "@/lib/utils";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { EncounterDetail } from "../hooks/useEncounter";

/* ======================================================
   TYPES
====================================================== */

interface Props {
  encounter: EncounterDetail;
}

type TimelineEventType =
  | "encounter"
  | "vitals"
  | "diagnosis"
  | "prescription"
  | "note";

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string | Date;
  description: string;
}

/* ======================================================
   BUILD TIMELINE
====================================================== */

function buildTimeline(encounter: EncounterDetail): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  /* Encounter created */

  events.push({
    id: `enc-${encounter.id}`,
    type: "encounter",
    timestamp: encounter.createdAt,
    description: "Encounter created",
  });

  /* Vitals */

  encounter.vitals?.forEach((vital) => {
    events.push({
      id: `v-${vital.id}`,
      type: "vitals",
      timestamp: vital.createdAt,
      description: "Vitals recorded",
    });
  });

  /* Diagnoses */

  encounter.diagnoses?.forEach((diagnosis) => {
    events.push({
      id: `d-${diagnosis.id}`,
      type: "diagnosis",
      timestamp: diagnosis.createdAt,
      description: diagnosis.description
        ? `Diagnosis added: ${diagnosis.description}`
        : "Diagnosis added",
    });
  });

  /* Prescriptions */

  encounter.prescriptions?.forEach((prescription) => {
    events.push({
      id: `p-${prescription.id}`,
      type: "prescription",
      timestamp: prescription.createdAt,
      description: "Prescription added",
    });
  });

  /* Clinical Notes */

  encounter.notes?.forEach((note) => {
    events.push({
      id: `n-${note.id}`,
      type: "note",
      timestamp: note.updatedAt ?? note.createdAt,
      description: "Clinical note updated",
    });
  });

  /* Sort newest first */

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

/* ======================================================
   COMPONENT
====================================================== */

export function TimelinePanel({ encounter }: Props) {
  const timeline = buildTimeline(encounter);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Timeline</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {timeline.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No clinical events recorded yet
          </p>
        )}

        {timeline.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div className="text-sm">{event.description}</div>

            <Badge variant="secondary">{formatDateTime(event.timestamp)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
