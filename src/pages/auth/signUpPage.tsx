import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { AlertCircleIcon, Eye, EyeOff } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

const formSchema = z
  .object({
    username: z.string().min(5, "Username too short"),
    email: z.email("Invalid Email Address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })

export function SignUpPage({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      setAuthError(null)

      const { error } = await authClient.signUp.email({
        name: formData.username,
        email: formData.email,
        password: formData.password,
        callbackURL: "http://localhost:5173/dashboard"
      }, {
        onSuccess: () => {
          return navigate(`/verifyEmail?email=${encodeURIComponent(formData.email)}`)
        }
      });

      if (error) {
        setAuthError(error.message || "An unexpected error occurred")
        return;
      }

    } catch (error) {
      setAuthError(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false);
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
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight mt-0! mb-0!">
              Start building your
              <br />
              second brain.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create an account to start writing without distractions.
            </p>
          </div>
          {}
          {authError && (
            <div className="flex items-center gap-2 p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircleIcon size={16}/>
              {authError}
            </div>
          )}
          <div className="flex flex-col gap-4.5">
            <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Username"
                  className=" h-10 px-4 py-2.5"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
                  className=" h-10 px-4 py-2.5"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
                  placeholder="Password"
                  className="px-4 py-2.5"
                  aria-invalid={fieldState.invalid}
                  required
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </InputGroupButton>
                </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
            )}
          />
          </div>
          <Field>
            <Button type="submit" className="w-full">
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link to="/" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
