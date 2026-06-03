import { Routes, Route } from "react-router-dom"
import { WelcomePage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage, StudentDashboard, CounselorDashboard, MentorDashboard, AdminDashboard, OAuthCallbackPage, NotFoundPage } from "@/pages"
import { ProtectedRoute } from "@/routes"

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />

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
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 — catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
