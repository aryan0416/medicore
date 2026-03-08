"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createEncounterSchema,
  CreateEncounterFormValues,
} from "@/features/encounters/schemas/encounter.schema";
import { useCreateEncounter } from "@/features/encounters/hooks/useCreateEncounter";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function NewEncounterPage() {
  const router = useRouter();
  const params = useParams();

  const patientId = params.id as string;

  const { createEncounter, isCreating } = useCreateEncounter();

  const form = useForm<CreateEncounterFormValues>({
    resolver: zodResolver(createEncounterSchema),
    defaultValues: {
      patientId,
      encounterType: "OPD",
      chiefComplaint: "",
    },
  });

  const onSubmit = async (values: CreateEncounterFormValues) => {
    try {
      await createEncounter(values);

      router.push("/dashboard/encounters");
    } catch (error) {
      console.error("Failed to create encounter", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Register New Encounter</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Encounter Type */}

              <FormField
                control={form.control}
                name="encounterType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Encounter Type</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select encounter type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="OPD">OPD</SelectItem>
                        <SelectItem value="IPD">IPD</SelectItem>
                        <SelectItem value="ER">Emergency</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chief Complaint */}

              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaint</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Enter patient's complaint"
                        rows={4}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? "Registering..." : "Register Encounter"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
