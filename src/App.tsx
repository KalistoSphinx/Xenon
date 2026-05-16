import { Outlet } from "react-router";

function App(){
  return(
    <div className="dark flex min-h-screen w-full items-center justify-center overflow-y-auto bg-neutral-950 text-white">
        <p
          className="absolute left-6 top-6 z-10 text-lg font-semibold tracking-[0.35em] uppercase text-white"
          aria-label="Xenon home"
        >
          Xenon
        </p>
        <Outlet />
    </div>
  )
}

export default App;
