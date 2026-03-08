"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createVital } from "../api/encounter.api";
import type { EncounterDetail } from "../hooks/useEncounter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface VitalsFormValues {
  temperature?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  pulse?: number;
  respiratoryRate?: number;
  spo2?: number;
  weight?: number;
}

interface Vital {
  id: string;
  temperature?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  pulse?: number;
  respiratoryRate?: number;
  spo2?: number;
  weight?: number;
}

interface VitalsFormProps {
  encounter: EncounterDetail;
}

/* ======================================================
   COMPONENT
====================================================== */

export function VitalsForm({ encounter }: VitalsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<VitalsFormValues>({
  defaultValues: {
    temperature: 0,
    bpSystolic: 0,
    bpDiastolic: 0,
    pulse: 0,
    respiratoryRate: 0,
    spo2: 0,
    weight: 0,
  },
});

  const mutation = useMutation({
    mutationFn: async (values: VitalsFormValues) => {
      return createVital({
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

  const onSubmit = async (values: VitalsFormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Existing Vitals

        {encounter.vitals?.length ? (
          <div className="text-sm space-y-2">
            {encounter.vitals.map((vital: Vital) => (
              <div key={vital.id} className="border rounded p-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-muted-foreground">Temp</span>
                    <p>{vital.temperature ?? "-"}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">BP</span>
                    <p>
                      {vital.bpSystolic ?? "-"} / {vital.bpDiastolic ?? "-"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Pulse</span>
                    <p>{vital.pulse ?? "-"}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Resp</span>
                    <p>{vital.respiratoryRate ?? "-"}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">SpO2</span>
                    <p>{vital.spo2 ?? "-"}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Weight</span>
                    <p>{vital.weight ?? "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No vitals recorded yet
          </p>
        )} */}

        {/* Record Vitals */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-3 gap-4"
          >
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bpSystolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BP Systolic</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bpDiastolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BP Diastolic</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pulse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pulse</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="respiratoryRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resp Rate</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spo2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SpO2</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="col-span-3">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Recording..." : "Record Vitals"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
