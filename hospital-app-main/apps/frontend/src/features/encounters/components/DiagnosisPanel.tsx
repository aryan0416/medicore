"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";

import { DiagnosisForm } from "./DiagnosisForm";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EncounterDetail } from "../hooks/useEncounter";

interface Props {
  encounter: EncounterDetail;
}

export function DiagnosisPanel({ encounter }: Props) {
  const [open, setOpen] = useState(false);

  const diagnoses = encounter.diagnoses ?? [];
  const latest = diagnoses[0];

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Diagnosis</CardTitle>

        <Button size="sm" onClick={() => setOpen(!open)}>
          Add Diagnosis
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
          {open && (
            <div className="border-t pt-4">
              <DiagnosisForm encounter={encounter} />
            </div>
          )}
        {latest && (
          <div className="border rounded-md p-4 space-y-2">
            <Badge variant="secondary">
              {formatDateTime(latest.createdAt)}
            </Badge>

            <div className="text-sm">
              <p className="font-medium">{latest.description || "Diagnosis"}</p>

              {latest.icdCode && (
                <p className="text-muted-foreground text-xs">
                  ICD: {latest.icdCode}
                </p>
              )}
            </div>
          </div>
              )}
              
        {!latest && (
          <p className="text-sm text-muted-foreground">
            No clinical notes recorded yet
          </p>
        )}

        {diagnoses.length > 1 && (
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Diagnosis</th>
                  <th className="p-2 text-left">ICD</th>
                </tr>
              </thead>

              <tbody>
                {diagnoses.slice(1).map((d: typeof diagnoses[number]) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">{formatDateTime(d.createdAt)}</td>

                    <td className="p-2">{d.description || "-"}</td>

                    <td className="p-2">{d.icdCode || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
