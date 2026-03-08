"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { VitalsForm } from "./VitalsForm";

interface Props {
  encounter: any;
}

export function VitalsPanel({ encounter }: Props) {
  const [open, setOpen] = useState(false);

  const vitals = encounter.vitals ?? [];
  
  const latest = vitals[0];
  
  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>Vitals</CardTitle>

        <Button size="sm" onClick={() => setOpen(!open)}>
          Record Vitals
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
      {/* Add new vitals */}
    
      {open && (
        <div className="border-t pt-4">
          <VitalsForm encounter={encounter} />
        </div>
      )}

        {/* Latest vitals */}

        {latest && (
          <div className="border rounded-md p-4 space-y-2">
            <Badge variant="secondary">
              {formatDateTime(latest.createdAt)}
            </Badge>

            <div className="grid grid-cols-3 gap-4 text-sm mt-2">
              <div>
                <span className="text-muted-foreground">Temp</span>
                <p>{latest.temperature ?? "-"}</p>
              </div>

              <div>
                <span className="text-muted-foreground">BP</span>
                <p>
                  {latest.bpSystolic ?? "-"} / {latest.bpDiastolic ?? "-"}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Pulse</span>
                <p>{latest.pulse ?? "-"}</p>
              </div>

              <div>
                <span className="text-muted-foreground">SpO2</span>
                <p>{latest.spo2 ?? "-"}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Resp</span>
                <p>{latest.respiratoryRate ?? "-"}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Weight</span>
                <p>{latest.weight ?? "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* History Table */}

        {vitals.length > 1 && (
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-2">Time</th>
                  <th className="p-2">Temp</th>
                  <th className="p-2">BP</th>
                  <th className="p-2">Pulse</th>
                  <th className="p-2">SpO2</th>
                </tr>
              </thead>

              <tbody>
                {vitals.slice(1).map((v: any) => (
                  <tr key={v.id} className="border-t">
                    <td className="p-2">{formatDateTime(v.createdAt)}</td>

                    <td className="p-2">{v.temperature ?? "-"}</td>

                    <td className="p-2">
                      {v.bpSystolic ?? "-"} / {v.bpDiastolic ?? "-"}
                    </td>

                    <td className="p-2">{v.pulse ?? "-"}</td>

                    <td className="p-2">{v.spo2 ?? "-"}</td>
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
