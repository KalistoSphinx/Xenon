import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useCallback } from "react";
import { AlertCircleIcon, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendReset = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        setAuthError(null);

        const { error } = await authClient.requestPasswordReset({
          email: email,
          redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/reset-password`,
        });

        if (error) {
          setAuthError(error.message || "An unexpected error occurred");
          return;
        }

        setEmailSent(true);
        setSentEmail(email);
        setCooldown(60);
      } catch (error) {
        setAuthError(
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    await handleSendReset(formData.email);
  }

  if (emailSent) {
    return (
      <div className="w-full">
        <div className={cn("flex flex-col gap-6", className)}>
          <FieldGroup>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight mt-0! mb-0!">
                Check your email
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We've sent a password reset link to{" "}
                <span className="font-medium text-foreground">
                  {sentEmail}
                </span>
                . Click the link in the email to reset your password.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder, or try
                again.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendReset(sentEmail)}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  "Resend reset link"
                )}
              </Button>
            </div>

            <Field>
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
              Forgot your
              <br />
              password?
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter the email address associated with your account and
              we&apos;ll send you a link to reset your password.
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    className="h-10 px-4 py-2.5"
                    required
                  />
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
                "Send reset link"
              )}
            </Button>
            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link
                to="/"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
