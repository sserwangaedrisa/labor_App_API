import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./providers";

import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LaborerDashboard from "../pages/laborer/Dashboard";

import ForemanDashboard from "../pages/foreman/Dashboard";
import WorkersPage from "../pages/foreman/Workers";
import AddDailyRecord from "../pages/foreman/AddDailyRecord";
// import OwnerDashboard from "../pages/owner/Dashboard";
import OwnerDashboard from "../pages/owner-dashboard/index";
import SettingsPage from "../pages/owner/Settings";
import ReportsPage from "../pages/owner/Reports";
import OwnerPayments from "../pages/owner/Payments";
import SitesPage from "../pages/owner/sites";
export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      {/* Laborer routes */}
      <Route
        path="/laborer"
        element={
          user?.role === "LABORER" ? (
            <LaborerDashboard />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />

      {/* Foreman routes */}
      <Route
        path="/foreman/dashboard"
        element={
          user?.role === "FOREMAN" ? (
            <ForemanDashboard />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/foreman/workers"
        element={
          user?.role === "FOREMAN" ? (
            <WorkersPage />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/foreman/add-daily-record"
        element={
          user?.role === "FOREMAN" ? (
            <AddDailyRecord />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      {/* Owner routes */}

      <Route
        path="/owner/dashboard"
        element={
          user?.role === "OWNER" ? (
            <OwnerDashboard />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />

      <Route
        path="/owner/workers"
        element={
          user?.role === "OWNER" ? (
            <WorkersPage />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />

      <Route
        path="/owner/payments"
        element={
          user?.role === "OWNER" ? (
            <OwnerPayments />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/owner/reports"
        element={
          user?.role === "OWNER" ? (
            <ReportsPage />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/owner/settings"
        element={
          user?.role === "OWNER" ? (
            <SettingsPage />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />

      <Route
        path="/owner/sites"
        element={
          user?.role === "OWNER" ? <SitesPage /> : <Navigate to="/auth/login" />
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
