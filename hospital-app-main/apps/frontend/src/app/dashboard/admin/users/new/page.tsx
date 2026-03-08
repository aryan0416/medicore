"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useCreateAdminUser } from "@/features/admin-users/hooks/useCreateAdminUser";

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

interface FormValues {
  email: string;
  fullName?: string;
}

export default function NewUserPage() {
  const router = useRouter();

  const { mutate, isPending } = useCreateAdminUser();

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  function onSubmit(values: FormValues) {
    mutate(values, {
      onSuccess: () => {
        router.push("/dashboard/admin/users");
      },
    });
  }

  return (
    <div className="max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Invite Staff User</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* NAME */}

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Dr. John Doe" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="doctor@hospital.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUTTONS */}

              <div className="flex gap-3">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Inviting..." : "Send Invite"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/admin/users")}
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
