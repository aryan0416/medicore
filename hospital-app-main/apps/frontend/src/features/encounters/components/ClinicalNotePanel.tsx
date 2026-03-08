"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";

import { ClinicalNoteEditor } from "./ClinicalNoteEditor";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EncounterDetail } from "../hooks/useEncounter";

interface Props {
  encounter: EncounterDetail;
}

export function ClinicalNotesPanel({ encounter }: Props) {
  const [open, setOpen] = useState(false);

  const notes = encounter.notes ?? [];

  const latest = notes[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clinical Notes</CardTitle>

        <Button size="sm" onClick={() => setOpen(!open)}>
          {latest ? "Edit Note" : "Add Note"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Editor */}

        {open && (
          <div className="border-t pt-4">
            <ClinicalNoteEditor encounter={encounter} />
          </div>
        )}

        {/* Latest Note */}

        {latest && (
          <div className="border rounded-md p-4 space-y-4">
            <Badge variant="secondary">
              {formatDateTime(latest.updatedAt || latest.createdAt)}
            </Badge>

            <div className="grid gap-4 text-sm">
              {latest.subjective && (
                <div>
                  <p className="text-muted-foreground text-xs">Subjective</p>

                  <p>{latest.subjective}</p>
                </div>
              )}

              {latest.objective && (
                <div>
                  <p className="text-muted-foreground text-xs">Objective</p>

                  <p>{latest.objective}</p>
                </div>
              )}

              {latest.assessment && (
                <div>
                  <p className="text-muted-foreground text-xs">Assessment</p>

                  <p>{latest.assessment}</p>
                </div>
              )}

              {latest.plan && (
                <div>
                  <p className="text-muted-foreground text-xs">Plan</p>

                  <p>{latest.plan}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!latest && (
          <p className="text-sm text-muted-foreground">
            No clinical notes recorded yet
          </p>
        )}

        {/* Version History */}

        {latest?.versions?.length > 0 && (
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Version</th>
                  <th className="p-2 text-left">Changed At</th>
                  <th className="p-2 text-left">Reason</th>
                </tr>
              </thead>

              <tbody>
                {((latest.versions as unknown as any[]) || []).map((v: any) => (
                  <tr key={v.id} className="border-t">
                    <td className="p-2">v{v.versionNumber}</td>

                    <td className="p-2">{formatDateTime(v.createdAt)}</td>

                    <td className="p-2">{v.reasonForChange || "-"}</td>
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
