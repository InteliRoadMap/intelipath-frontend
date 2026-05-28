import { Routes, Route } from "react-router-dom"
import WelcomePage from "../pages/WelcomePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import ResetPasswordPage from "../pages/ResetPasswordPage"
import DashboardPage from "../pages/DashboardPage"
import NotFoundPage from "../pages/NotFoundPage"
import ProtectedRoute from "../components/ProtectedRoute"

import StudentDashboard from "../pages/StudentDashboard"
import CounselorDashboard from "../pages/CounselorDashboard"
import MentorDashboard from "../pages/MentorDashboard"

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/counselor"
        element={
          <ProtectedRoute>
            <CounselorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/mentor"
        element={
          <ProtectedRoute>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 — catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
