"use client";

import { useRouter, useParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { useDepartment } from "@/features/departments/hooks/useDepartment";
import { useUpdateDepartment } from "@/features/departments/hooks/useUpdateDepartment";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateDepartmentInput, createDepartmentSchema } from "@/features/departments/schemas/departments.schema";
import { Textarea } from "@/components/ui/textarea";

export default function DepartmentPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading } = useDepartment(id);

  const { mutate, isPending } = useUpdateDepartment();

  const form = useForm<CreateDepartmentInput>({
    resolver: zodResolver(createDepartmentSchema),
  });

  if (data && !form.getValues("name")) {
    form.reset(data.data);
  }

  function onSubmit(values: CreateDepartmentInput) {
    mutate(
      { id, payload: values },
      {
        onSuccess: () => {
          router.push("/dashboard/admin/departments");
        },
      },
    );
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Department</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* NAME */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CODE */}

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUTTONS */}

              <div className="flex gap-3">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Department"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/admin/departments")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
