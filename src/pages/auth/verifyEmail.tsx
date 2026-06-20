import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Mail } from "@hugeicons/core-free-icons";
import { MailCheck } from "lucide-react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

export function VerifyEmail() {

  const handleResend = async (email: string) => {
    try {
      await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "http://localhost:5173/dashboard"
      })

      toast.success("Email sent successfully", {position: "top-center"})
    } catch (error) {
      toast.error(String(error), {position: "top-center"})
    }
  };

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email")

  return (
    <div className="flex items-center flex-col mb-10">
      
      <div className="w-full">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <MailCheck className="w-6 h-6 text-primary" />
              </div>
        <div className="flex flex-col gap-2 mb-2">
            <h1 className="mt-5 text-3xl font-semibold tracking-tight mb-0!">
              Verify your email </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You're almost there! we have sent a verification link to <span className="font-medium text-foreground">
                  {email}
                </span>
            </p>
          </div>
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            Just click on the button in that email to complete your sign up. If
            you don't see it , you may need to <span className="font-medium text-foreground">
                  check your spam
                </span> folder.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-10">
            Still don't see it, click the button below.
          </p>
          <Button className={"mt-4"} onClick={() => handleResend(email!)}>Resend Email</Button>
        </div>
      </div>
    </div>
  );
}

