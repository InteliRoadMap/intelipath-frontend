import { Routes, Route } from "react-router-dom"
import { WelcomePage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage, StudentDashboard, StudentRoadmap, AIMentorPage, CounselorDashboard, MentorDashboard, AdminDashboard, OAuthCallbackPage, NotFoundPage } from "@/pages"
import {
  WelcomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DashboardPage,
  StudentDashboard,
  StudentRoadmap,
  CounselorDashboard,
  CounselorFeedbackPage,
  MentorDashboard,
  AdminDashboard,
  OAuthCallbackPage,
  NotFoundPage,
  ProfileSettingsPage,
  MentorProfileSettingsPage,
  CounselorProfileSettingsPage,
  AIMentorPage
} from "@/pages"
import { ProtectedRoute } from "@/routes"
import { ROLES, ROUTES } from "@/shared"

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
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_STUDENT_ROADMAP}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentRoadmap />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AI_MENTOR}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <AIMentorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_COUNSELOR}
        element={
          <ProtectedRoute allowedRoles={[ROLES.COUNSELOR]}>
            <CounselorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.COUNSELOR_FEEDBACK}
        element={
          <ProtectedRoute allowedRoles={[ROLES.COUNSELOR]}>
            <CounselorFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_MENTOR}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_ADMIN}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AI_MENTOR}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <AIMentorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE_SETTINGS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <ProfileSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.MENTOR_SETTINGS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorProfileSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.COUNSELOR_SETTINGS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.COUNSELOR]}>
            <CounselorProfileSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 — catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
