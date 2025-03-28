import { z } from "zod";
import { toast } from "sonner";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "./ContextAPI/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useNavigate } from "react-router";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const { data } = await axios.post("https://reqres.in/api/login", values);
      if (data.token) {
        toast.success("Logged in successfully", {
          style: { backgroundColor: "#34D399", color: "#f8fafc" },
        });
        login({ token: data.token });
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid email or password", {
        style: { backgroundColor: "#EF4444", color: "#f8fafc" },
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 ">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      {...field}
                      icon={Mail}
                      type="email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
                      placeholder="••••••••"
                      {...field}
                      icon={LockKeyhole}
                      type="password"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer">
              Sign in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
