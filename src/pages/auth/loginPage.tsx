import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { AlertCircleIcon } from "lucide-react"

const formSchema = z.object({
  email: z.email("Invalid Email Address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setAuthError(null)

      const {error} = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/dashboard"
      })

      if(error){
        setAuthError(error.message || "An unexpected error occurred")
        return
      }


    } catch (error) {
      setAuthError(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
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
              Your knowledge,
              <br />
              organized.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to your workspace and pick up where you left off.
            </p>
          </div>
          {authError && (
            <div className="flex items-center gap-2 p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircleIcon size={16}/>
              {authError}
            </div>
          )}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="m@example.com"
                  required
                />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} /> }
            </Field>
              
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    to="#"
                    className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="password"
                  required
                />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} /> }
            </Field>
              
            )}
          />
          <Field>
            <Button type="submit" className="w-full">
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link to="signup" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Create one
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}