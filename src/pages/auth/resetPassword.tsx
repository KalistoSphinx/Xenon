import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Link, useSearchParams } from "react-router";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  AlertCircleIcon,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPassword({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });



  async function onSubmit(formData: z.infer<typeof formSchema>) {
    if (!token) {
      setAuthError("Reset token is missing. Please request a new reset link.");
      return;
    }

    try {
      setLoading(true);
      setAuthError(null);

      const { error } = await authClient.resetPassword({
        newPassword: formData.password,
        token: token,
      });

      if (error) {
        setAuthError(error.message || "An unexpected error occurred");
        return;
      }

      setResetSuccess(true);
      toast.success("Password reset successfully", {
        position: "bottom-center",
      });
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  // No token in URL
  if (!token) {
    return (
      <div className="w-full">
        <div className={cn("flex flex-col gap-6", className)}>
          <FieldGroup>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-2">
                <AlertCircleIcon className="w-6 h-6 text-destructive" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight mt-0! mb-0!">
                Invalid reset link
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>

            <Field>
              <Link to="/forgot-password">
                <Button type="button" className="w-full">
                  Request new reset link
                </Button>
              </Link>
              <FieldDescription className="text-center">
                <Link
                  to="/"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Back to sign in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="w-full">
        <div className={cn("flex flex-col gap-6", className)}>
          <FieldGroup>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight mt-0! mb-0!">
                Password reset
                <br />
                successful
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your password has been updated. You can now sign in with your
                new password.
              </p>
            </div>

            <Field>
              <Link to="/">
                <Button type="button" className="w-full">
                  Sign in
                </Button>
              </Link>
            </Field>
          </FieldGroup>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="text-3xl font-semibold tracking-tight mt-0! mb-0!">
              Create a new
              <br />
              password
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter a new password for your account.
            </p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircleIcon size={16} />
              {authError}
            </div>
          )}

          <div className="flex flex-col gap-4.5">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="h-10">
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      className="px-4 py-2.5"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="h-10">
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="px-4 py-2.5"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reset password"
              )}
            </Button>
            <FieldDescription className="text-center">
              <Link
                to="/"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Back to sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
