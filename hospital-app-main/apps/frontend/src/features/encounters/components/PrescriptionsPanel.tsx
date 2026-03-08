"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";

import { PrescriptionsForm } from "./PrescriptionsForm";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  encounter: any;
}

export function PrescriptionsPanel({ encounter }: Props) {
  const [open, setOpen] = useState(false);

  const prescriptions = encounter.prescriptions ?? [];

  const latest = prescriptions[0];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Prescriptions</CardTitle>

        <Button size="sm" onClick={() => setOpen(!open)}>
          Add Prescription
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
      {/* Add Prescription */}
    
      {open && (
        <div className="border-t pt-4">
          <PrescriptionsForm encounter={encounter} />
        </div>
        )}
        
        {/* Latest Prescription */}

        {latest && (
          <div className="border rounded-md p-4 space-y-2">
            <Badge variant="secondary">
              {formatDateTime(latest.createdAt)}
            </Badge>

            <div className="text-sm space-y-1">
              <p className="font-medium">Medicine ID: {latest.medicineId}</p>

              <p className="text-muted-foreground text-xs">
                {latest.dosage || "-"} • {latest.frequency || "-"} •{" "}
                {latest.duration || "-"}
              </p>

              {latest.instructions && (
                <p className="text-xs">{latest.instructions}</p>
              )}
            </div>
          </div>
        )}

        {!latest && (
          <p className="text-sm text-muted-foreground">
            No prescriptions added yet
          </p>
        )}

        {/* History Table */}

        {prescriptions.length > 1 && (
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Medicine</th>
                  <th className="p-2 text-left">Dosage</th>
                  <th className="p-2 text-left">Frequency</th>
                  <th className="p-2 text-left">Duration</th>
                </tr>
              </thead>

              <tbody>
                {prescriptions.slice(1).map((p: any) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{formatDateTime(p.createdAt)}</td>

                    <td className="p-2">{p.medicineId}</td>

                    <td className="p-2">{p.dosage || "-"}</td>

                    <td className="p-2">{p.frequency || "-"}</td>

                    <td className="p-2">{p.duration || "-"}</td>
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
