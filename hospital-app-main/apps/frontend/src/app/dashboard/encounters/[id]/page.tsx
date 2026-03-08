"use client";

import { useParams } from "next/navigation";

import { useEncounter } from "@/features/encounters/hooks/useEncounter";

import { EncounterHeader } from "@/features/encounters/components/EncounterHeader";
import { VitalsPanel } from "@/features/encounters/components/VitalsPanel";
import { DiagnosisPanel } from "@/features/encounters/components/DiagnosisPanel";
import { PrescriptionsPanel } from "@/features/encounters/components/PrescriptionsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClinicalNotesPanel } from "@/features/encounters/components/ClinicalNotePanel";
import { TimelinePanel } from "@/features/encounters/components/TimelinePanel";

/* ======================================================
   PAGE
====================================================== */

export default function EncounterDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { encounter, isLoading } = useEncounter(id);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground py-10 text-center">
        Loading encounter...
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="text-sm text-muted-foreground py-10 text-center">
        Encounter not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encounter Header */}

      <EncounterHeader encounter={encounter} />

      {/* Clinical Tabs */}

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="vitals">Vitals</TabsTrigger>

          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>

          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>

          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>

          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* VITALS TAB */}

        <TabsContent value="vitals" className="mt-4">
          <VitalsPanel encounter={encounter} />
        </TabsContent>

        {/* DIAGNOSIS TAB */}

        <TabsContent value="diagnosis" className="mt-4">
          <DiagnosisPanel encounter={encounter} />
        </TabsContent>

        {/* CLINICAL NOTES TAB */}

        <TabsContent value="notes" className="mt-4">
          <ClinicalNotesPanel encounter={encounter} />
        </TabsContent>

        {/* PRESCRIPTIONS TAB */}

        <TabsContent value="prescriptions" className="mt-4">
          <PrescriptionsPanel encounter={encounter} />
        </TabsContent>

        {/* TIMELINE TAB */}

        <TabsContent value="timeline" className="mt-4">
          <TimelinePanel encounter={encounter} />
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
