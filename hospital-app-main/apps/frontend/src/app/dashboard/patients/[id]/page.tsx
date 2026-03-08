"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import { usePatient } from "@/features/patients/hooks/usePatient";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PatientTableSkeleton } from "@/features/patients/components/PatientsTableSkeleton";

export default function PatientDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = usePatient(id);

  if (isLoading) {
    return <PatientTableSkeleton />;
  }

  const patient = data?.data;

  if (!patient) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Patient not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patient Profile</h1>

        <Link href={`/dashboard/patients/${id}/encounters/new`}>
          <Button>Create Encounter</Button>
        </Link>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {patient.firstName} {patient.lastName}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">UHID</span>
            <p>{patient.uhid}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Gender</span>
            <p>{patient.gender}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Phone</span>
            <p>{patient.phone || "-"}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Blood Group</span>
            <p>{patient.bloodGroup || "-"}</p>
          </div>

          <div>
            <span className="text-muted-foreground">DOB</span>
            <p>{patient.dob || "-"}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Address</span>
            <p>{patient.address || "-"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
