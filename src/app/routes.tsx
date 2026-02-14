import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./providers";

import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LaborerDashboard from "../pages/laborer/Dashboard";

import ForemanDashboard from "../pages/foreman/Dashboard";
import WorkersPage from "../pages/foreman/Workers";
import AddDailyRecord from "../pages/foreman/AddDailyRecord";
import OwnerDashboard from "../pages/owner/Dashboard";
export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      {/* Laborer routes */}
      <Route
        path="/laborer/*"
        element={
          user?.role === "laborer" ? <LaborerDashboard /> : <Navigate to="/auth/login" />
        }
      />

      {/* Foreman routes */}
      <Route
        path="/foreman/dashboard"
        element={
          user?.role === "foreman" ? <ForemanDashboard /> : <Navigate to="/auth/login" />
        }
      />
      <Route
        path="/foreman/workers"
        element={
          user?.role === "foreman" ? <WorkersPage /> : <Navigate to="/auth/login" />
        }
      />
      <Route
        path="/foreman/add-daily-record"
        element={
          user?.role === "foreman" ? <AddDailyRecord /> : <Navigate to="/auth/login" />
        }
      />
        {/* Owner routes */}

        <Route path="/owner/dashboard" element={<OwnerDashboard />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
