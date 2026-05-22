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
        <Route path="dashboard" element={<HomePage />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
