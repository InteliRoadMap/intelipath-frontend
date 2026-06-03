import { Routes, Route } from "react-router-dom"
import { WelcomePage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage, StudentDashboard, CounselorDashboard, MentorDashboard, AdminDashboard, OAuthCallbackPage, NotFoundPage } from "@/pages"
import { ProtectedRoute } from "@/routes"
import { ROUTES } from "@/shared"

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<WelcomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallbackPage />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_STUDENT}
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_COUNSELOR}
        element={
          <ProtectedRoute>
            <CounselorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_MENTOR}
        element={
          <ProtectedRoute>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_ADMIN}
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
