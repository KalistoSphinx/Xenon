import { Navigate, Outlet } from "react-router";
import { authClient } from "../lib/auth-client";
import Loader from "@/components/custom/Loader";

export function UnauthorizedRoute() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <Loader />;
  }

  if(error){
    return <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold">{error.name}</h1>
        <p className="mt-2 text-gray-500">{error.message}</p>
      </div>
    </div>
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
