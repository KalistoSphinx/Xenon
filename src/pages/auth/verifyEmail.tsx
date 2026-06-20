import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { MailOpen } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation } from "react-router";
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

  const location = useLocation()
  const {email} = location.state

  return (
    <div className="flex items-center flex-col text-center mb-10">
      <HugeiconsIcon size={40} icon={MailOpen} />
      <div className="w-140">
        <div className="mt-5">
          <p className="text-2xl font-bold mb-4">Please verify your email</p>
          <Separator />
          <p className="text-[16px] mt-4">
            You're almost there! we have sent a verification link to <b>{email}</b>
          </p>
        </div>
        <div>
          <p className="text-[16px] mt-7">
            Just click on the button in that email to complete your sign up. If
            you don't see it , you may need to <b>check your spam</b> folder.
          </p>
          <p className="text-[16px] mt-5">
            Still don't see it, click the button below.
          </p>
          <Button className={"mt-6"} onClick={() => handleResend(email)}>Resend Email</Button>
        </div>
      </div>
    </div>
  );
}
