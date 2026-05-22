import { Outlet } from "react-router";
import { Toaster } from "sonner";

function App(){
  return(
    <div className="dark flex flex-col min-h-screen w-full bg-neutral-950 text-white">
        <nav className="w-full p-6">
          <p
            className="text-lg font-semibold tracking-[0.35em] uppercase text-white"
            aria-label="Xenon home"
          >
            Xenon
          </p>
        </nav>
        <main className="flex flex-1 items-center justify-center overflow-y-auto w-full">
          <Outlet />
        </main>
        <Toaster />
    </div>
  )
}

export default App;
