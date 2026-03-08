"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDiagnosis } from "../api/encounter.api";
import type { EncounterDetail } from "../hooks/useEncounter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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

interface DiagnosisFormValues {
  icdCode?: string;
  description?: string;
  isPrimary?: boolean;
}

interface Diagnosis {
  id: string;
  description?: string;
  icdCode?: string;
  isPrimary?: boolean;
}

interface DiagnosisFormProps {
  encounter: EncounterDetail;
}

/* ======================================================
   COMPONENT
====================================================== */

export function DiagnosisForm({ encounter }: DiagnosisFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<DiagnosisFormValues>({
    defaultValues: {
      icdCode: "",
      description: "",
      isPrimary: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DiagnosisFormValues) => {
      return createDiagnosis({
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

  const onSubmit = async (values: DiagnosisFormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Existing Diagnoses

        {encounter.diagnoses?.length ? (
          <div className="space-y-2 text-sm">
            {encounter.diagnoses.map((diagnosis: Diagnosis) => (
              <div key={diagnosis.id} className="border rounded p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {diagnosis.description || "-"}
                    </p>

                    {diagnosis.icdCode && (
                      <p className="text-muted-foreground text-xs">
                        ICD: {diagnosis.icdCode}
                      </p>
                    )}
                  </div>

                  {diagnosis.isPrimary && (
                    <span className="text-xs font-medium text-primary">
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No diagnoses recorded yet
          </p>
        )} */}

        {/* Add Diagnosis */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="icdCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICD Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional ICD code" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Diagnosis description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Primary Diagnosis</FormLabel>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
              {mutation.isPending ? "Adding..." : "Add Diagnosis"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
