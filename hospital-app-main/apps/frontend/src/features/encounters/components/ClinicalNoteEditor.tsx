"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createClinicalNote,
  updateClinicalNote,
  getClinicalNoteHistory,
} from "../api/encounter.api";

import type { EncounterDetail } from "../hooks/useEncounter";

import { Button } from "@/components/ui/button";
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

interface ClinicalNoteValues {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  reasonForChange?: string;
}

interface ClinicalNoteEditorProps {
  encounter: EncounterDetail;
}

/* ======================================================
   COMPONENT
====================================================== */

export function ClinicalNoteEditor({ encounter }: ClinicalNoteEditorProps) {
  const queryClient = useQueryClient();

  const existingNote = encounter.notes?.[0];

  const form = useForm<ClinicalNoteValues>({
    defaultValues: {
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    },
  });

  useEffect(() => {
    if (existingNote) {
      const content = typeof existingNote.content === 'string' ? JSON.parse(existingNote.content) : existingNote.content;
      form.reset({
        subjective: content?.subjective ?? "",
        objective: content?.objective ?? "",
        assessment: content?.assessment ?? "",
        plan: content?.plan ?? "",
      });
    }
  }, [existingNote, form]);

  const createMutation = useMutation({
    mutationFn: async (values: ClinicalNoteValues) => {
      return createClinicalNote({
        encounterId: encounter.id,
        ...values,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["encounter", encounter.id],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ClinicalNoteValues) => {
      if (!existingNote) return;

      return updateClinicalNote(existingNote.id, values);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["encounter", encounter.id],
      });
    },
  });

  const onSubmit = async (values: ClinicalNoteValues) => {
    if (!existingNote) {
      await createMutation.mutateAsync(values);
    } else {
      await updateMutation.mutateAsync(values);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Notes (SOAP)</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjective</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Patient symptoms and history"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Clinical observations"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assessment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Doctor assessment"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Treatment plan"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {existingNote && (
              <FormField
                control={form.control}
                name="reasonForChange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Update</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="Why is this note being updated?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : existingNote
                  ? "Update Clinical Note"
                  : "Create Clinical Note"}
            </Button>
          </form>
        </Form>

        {/* {existingNote && (
          <Button
            variant="outline"
            onClick={() =>
              getClinicalNoteHistory(existingNote.id).then(console.log)
            }
          >
            View Note History
          </Button>
        )} */}
      </CardContent>
    </Card>
  );
}
