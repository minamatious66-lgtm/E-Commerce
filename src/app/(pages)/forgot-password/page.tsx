"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, VerifyResetCodeResponse } from "@/Interfaces/authInterface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const codeSchema = z.object({
  resetCode: z.string().min(1, { message: "Reset code is required" }),
});

const resetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { resetCode: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "", newPassword: "" },
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgotPasswords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData: ForgotPasswordResponse = await response.json();
      if (response.ok) {
        toast.success(resData.message || "Reset code sent to your email");
        setUserEmail(data.email);
        setStep(2);
      } else {
        toast.error(resData.message || "Failed to send reset code");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onCodeSubmit = async (data: CodeFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyResetCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData: VerifyResetCodeResponse = await response.json();
      if (response.ok) {
        toast.success("Code verified successfully");
        resetForm.setValue("email", userEmail);
        setStep(3);
      } else {
        toast.error("Invalid reset code");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetPassword`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData: ResetPasswordResponse = await response.json();
      if (response.ok) {
        toast.success("Password reset successfully! Please login.");
        router.push("/login");
      } else {
        toast.error("Failed to reset password");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-20">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify Reset Code"}
            {step === 3 && "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Enter your email to receive a reset code."}
            {step === 2 && "Enter the reset code sent to your email."}
            {step === 3 && "Now you can set your new password."}
          </CardDescription>
        </CardHeader>

        {step === 1 && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input className="my-3" placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full my-3" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...codeForm}>
            <form onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={codeForm.control}
                  name="resetCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reset Code</FormLabel>
                      <FormControl>
                        <Input className="my-3" placeholder="Enter 6-digit code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full my-3" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                  Back to Email
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input className="my-3" type="password" placeholder="Min 6 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full my-3" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
