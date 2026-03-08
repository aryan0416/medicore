"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createEncounterSchema,
  type CreateEncounterFormValues,
} from "@/features/encounters/schemas/encounter.schema";

import { encountersApi } from "@/features/encounters/api/encounter.api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewEncounterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const patientId = searchParams.get("patientId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateEncounterFormValues>({
    resolver: zodResolver(createEncounterSchema),
    defaultValues: {
      patientId: patientId ?? "",
      encounterType: "OPD",
      chiefComplaint: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (values: CreateEncounterFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const encounter = await encountersApi.create(values);

      router.replace(`/dashboard/encounters/${encounter.id}`);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create encounter";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!patientId) {
    return (
      <div className="max-w-xl">
        <h1 className="text-xl font-semibold">Invalid Request</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Patient ID is required to create an encounter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">New Encounter</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient ID */}

        <div className="space-y-2">
          <Label>Patient ID</Label>

          <Input {...register("patientId")} disabled />

          {errors.patientId && (
            <p className="text-sm text-red-500">{errors.patientId.message}</p>
          )}
        </div>

        {/* Encounter Type */}

        <div className="space-y-2">
          <Label>Encounter Type</Label>

          <Controller
            name="encounterType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value as "OPD" | "IPD" | "ER")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select encounter type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="OPD">OPD</SelectItem>
                  <SelectItem value="IPD">IPD</SelectItem>
                  <SelectItem value="ER">Emergency</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.encounterType && (
            <p className="text-sm text-red-500">
              {errors.encounterType.message}
            </p>
          )}
        </div>

        {/* Chief Complaint */}

        <div className="space-y-2">
          <Label>Chief Complaint</Label>

          <Input
            {...register("chiefComplaint")}
            placeholder="e.g. Chest pain, fever..."
          />

          {errors.chiefComplaint && (
            <p className="text-sm text-red-500">
              {errors.chiefComplaint.message}
            </p>
          )}
        </div>

        {/* Error Message */}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit */}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Encounter"}
        </Button>
      </form>
    </div>
  );
}
