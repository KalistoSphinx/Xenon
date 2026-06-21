import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchWhenOffline: false,
  },
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
