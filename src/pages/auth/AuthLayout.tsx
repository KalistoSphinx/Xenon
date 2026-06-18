import { Outlet } from "react-router";

function XenonLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="14" height="17" rx="2" />
      <path d="M7 1h12a2 2 0 0 1 2 2v14" />
      <path d="M7 10h6" />
      <path d="M7 13h8" />
      <path d="M7 16h4" />
    </svg>
  );
}

// --- Right Panel ---
function RightPanel() {
  return (
    <div className="h-full w-full px-12 pt-15 xl:px-16">
      <div
        className="w-full max-w-120 animate-auth-fade-in absolute top-54"
        style={{ animationDelay: "150ms" }}
      >
        <div>
          <div
            className="text-[40px] font-bold tracking-tight text-foreground leading-[1.1] animate-auth-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Think
          </div>
          <div
            className="text-[40px] font-bold tracking-tight text-foreground leading-[1.1] animate-auth-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Write
          </div>
          <div
            className="text-[40px] font-bold tracking-tight text-muted-foreground leading-[1.1] animate-auth-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Remember
          </div>
        </div>

        <p className="mt-8 max-w-95 text-[16px] leading-[1.7] text-muted-foreground">
          A personal workspace for capturing ideas, writing without
          distractions, and building a knowledge system that grows with you.
        </p>

        <div className="mt-23">
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40 select-none">
            Built for focus
          </span>
        </div>
      </div>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-4 lg:flex-1 lg:min-w-120">
        <div className="auth-dot-grid absolute inset-0 opacity-40" />

        <div className="relative z-10 flex w-full max-w-100 flex-col">
          <div className="mb-10 animate-auth-fade-in">
            <div className="flex items-center gap-2.5 mb-1 mt-2">
              <XenonLogo className="w-6 h-6 text-foreground" />
              <span className="text-base font-semibold tracking-[0.2em] uppercase text-foreground">
                Xenon
              </span>
            </div>
          </div>

          <div
            className="animate-auth-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <Outlet />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[45%] shrink-0 border-l border-border bg-cover bg-[url('./assets/images/graphic.png')]">
        <RightPanel />
      </div>
    </div>
  );
}
