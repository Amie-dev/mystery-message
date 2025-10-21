// src/app/verify/[username]/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams, notFound } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { verifySchemaValidation } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams();
  const username = typeof params.username === "string" ? params.username : "";

  if (!username) return notFound();

  const form = useForm<z.infer<typeof verifySchemaValidation>>({
    resolver: zodResolver(verifySchemaValidation),
    defaultValues: {
      code: "", // Ensures controlled input
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof verifySchemaValidation>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });

      toast.success(response.data?.message || "Verification successful");
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ?? "Verification failed";
      toast.error(errorMessage);
      console.error("Verification failed:", errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>
        <p className="text-center text-gray-600 mb-6">
          Hi <strong>{username}</strong>, we’ve sent a verification code to your email.
          Please enter it below to complete your registration.
        </p>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    This code was sent to your registered email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Please wait..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
