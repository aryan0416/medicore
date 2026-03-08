"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  createPatientSchema,
  type CreatePatientInput,
} from "@/features/patients/schemas/createPatient.schema";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientsApi } from "@/features/patients/api/patients.api";

export default function CreatePatientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      patient: {
        firstName: "",
        lastName: "",
        gender: "male",
        dob: "",
        phone: "",
        address: "",
        bloodGroup: "",
      },
      contact: {
        name: "",
        relation: "",
        phone: "",
      },
      insurance: {
        provider: "",
        policyNumber: "",
        validUntil: "",
      },
    },
  });

  function cleanOptional(value?: string) {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  async function onSubmit(data: CreatePatientInput) {
    setServerError(null);

    const payload: CreatePatientInput = {
      patient: {
        ...data.patient,
        phone: cleanOptional(data.patient.phone),
        address: cleanOptional(data.patient.address),
        bloodGroup: cleanOptional(data.patient.bloodGroup),
        dob: cleanOptional(data.patient.dob),
      },

      contact:
        data.contact?.name || data.contact?.phone || data.contact?.relation
          ? {
              name: cleanOptional(data.contact.name) || "",
              relation: cleanOptional(data.contact.relation) || "",
              phone: cleanOptional(data.contact.phone) || "",
            }
          : undefined,

      insurance:
        data.insurance?.provider ||
        data.insurance?.policyNumber ||
        data.insurance?.validUntil
          ? {
              provider: cleanOptional(data.insurance.provider) || "",
              policyNumber: cleanOptional(data.insurance.policyNumber) || "",
              validUntil: cleanOptional(data.insurance.validUntil) || "",
            }
          : undefined,
    };

    try {
      await patientsApi.create(payload);

      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      router.push("/dashboard/patients");
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "Failed to create patient",
      );
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Patient</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* BASIC INFORMATION */}

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              {/* FIRST NAME */}

              <FormField
                control={form.control}
                name="patient.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rahul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LAST NAME */}

              <FormField
                control={form.control}
                name="patient.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GENDER */}

              <FormField
                control={form.control}
                name="patient.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}

              <FormField
                control={form.control}
                name="patient.dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* PHONE */}

              <FormField
                control={form.control}
                name="patient.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* BLOOD GROUP */}

              <FormField
                control={form.control}
                name="patient.bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* ADDRESS */}

              <FormField
                control={form.control}
                name="patient.address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street, City, State" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* OPTIONAL SECTIONS */}

          <Accordion type="multiple" className="w-full space-y-2">
            {/* CONTACT */}

            <AccordionItem value="contact" className="border rounded-lg px-4">
              <AccordionTrigger>Emergency Contact</AccordionTrigger>

              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2 pb-4">
                  <FormField
                    control={form.control}
                    name="contact.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* INSURANCE */}

            <AccordionItem value="insurance" className="border rounded-lg px-4">
              <AccordionTrigger>Insurance Details</AccordionTrigger>

              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2 pb-4">
                  <FormField
                    control={form.control}
                    name="insurance.provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insurance.policyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insurance.validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Until</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              Create Patient
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
