"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPrescription } from "../api/encounter.api";
import type { EncounterDetail } from "../hooks/useEncounter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

/* ======================================================
   TYPES
====================================================== */

interface PrescriptionFormValues {
  medicineId: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

interface PrescriptionsFormProps {
  encounter: EncounterDetail;
}

/* ======================================================
   COMPONENT
====================================================== */

export function PrescriptionsForm({ encounter }: PrescriptionsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<PrescriptionFormValues>({
    defaultValues: {
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: PrescriptionFormValues) => {
      return createPrescription({
        encounterId: encounter.id,
        ...values,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["encounter", encounter.id],
      });

      form.reset();
    },
  });

  const onSubmit = async (values: PrescriptionFormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescriptions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Existing Prescriptions

        {encounter.prescriptions?.length ? (
          <div className="space-y-2 text-sm">
            {encounter.prescriptions.map((p: any) => (
              <div key={p.id} className="border rounded p-3">
                <div className="font-medium">{p.medicineId}</div>

                <div className="text-muted-foreground text-xs">
                  {p.dosage && <span>{p.dosage} • </span>}
                  {p.frequency && <span>{p.frequency} • </span>}
                  {p.duration && <span>{p.duration}</span>}
                </div>

                {p.instructions && (
                  <div className="text-xs mt-1">{p.instructions}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No prescriptions added yet
          </p>
        )} */}

        {/* Add Prescription */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="medicineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine</FormLabel>
                  <FormControl>
                    <Input placeholder="Medicine name or ID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 500 mg" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. twice daily" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 5 days" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Additional instructions"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending
                ? "Adding Prescription..."
                : "Add Prescription"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
