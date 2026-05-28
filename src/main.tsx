import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import { LoginPage } from "./pages/loginPage.tsx";
import { SignUpPage } from "./pages/signUpPage.tsx";
import { ProtectedRoute } from "./routes/protectedRoute.tsx";
import HomePage from "./pages/Dashboard.tsx";
import { UnauthorizedRoute } from "./routes/UnauthorizedRoute.tsx";
import { AllNotes } from "./pages/Notes.tsx";
import { StarredNotes } from "./pages/Starred.tsx";
import { TrashNotes } from "./pages/Trash.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route element={<UnauthorizedRoute />}>
          <Route path="" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<HomePage />}>
          <Route path="notes" element={<AllNotes />} />
          <Route path="starred" element={<StarredNotes />} />
          <Route path="trash" element={<TrashNotes />} />
        </Route>
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
