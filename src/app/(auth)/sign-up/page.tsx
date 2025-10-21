// src/app/(auth)/sign-in/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import { signUpSchemaValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [debouncedUsername] = useDebounceValue(username.trim(), 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchemaValidation>>({
    resolver: zodResolver(signUpSchemaValidation),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });
  useEffect(() => {
    if (!debouncedUsername) return;

    const checkUsernameUnique = async () => {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data?.message ?? "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchemaValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      await setResponseMessage(response.data?.message);

      toast.success("Signup successful!");
      console.log(response.data?.message);

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ?? "Signup failed";
      toast.error(errorMessage);
      console.log("Signup failed",errorMessage)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Join Mystery Message
          </h1>
          <p className="text-sm text-gray-500">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    {isCheckingUsername
                      ? "Checking availability..."
                      : usernameMessage || "Username is unavailable"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Please wait..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already joined?{" "}
            <Link href="/sign-in" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
