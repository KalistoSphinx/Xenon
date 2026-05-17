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

const formSchema = z.object({
  email: z.email("Invalid Email Address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="max-w-xs w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
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
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
            <Button type="submit">Login</Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link to="signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
