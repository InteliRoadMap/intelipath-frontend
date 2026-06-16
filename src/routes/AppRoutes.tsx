import { Routes, Route } from "react-router-dom"
import { 
  WelcomePage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, 
  DashboardPage, StudentDashboardPage, StudentRoadmapPage, AIMentorPage, 
  CounselorDashboardPage, CounselorFeedbackPage, MentorDashboardPage, AdminDashboardPage, 
  OAuthCallbackPage, NotFoundPage, ProfileSettingsPage, MentorProfileSettingsPage, 
  CounselorProfileSettingsPage, StudentPortfolioPage, MentorStudentsPage,
  MentorFeedbackPage, MentorPortfolioPage, StudentFeedbackPage, StudentProfileSettingsPage
} from "@/pages"
import { ProtectedRoute, GuestRoute } from "@/routes"
import { ROLES, ROUTES } from "@/shared"

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<GuestRoute><WelcomePage /></GuestRoute>} />

      <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path={ROUTES.RESET_PASSWORD} element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
      <Route path={ROUTES.OAUTH_CALLBACK} element={<GuestRoute><OAuthCallbackPage /></GuestRoute>} />

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
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_STUDENT_ROADMAP}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentRoadmapPage />
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
        path={ROUTES.DASHBOARD_STUDENT_PORTFOLIO}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.MENTOR]}>
            <StudentPortfolioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_STUDENT_SETTINGS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentProfileSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_STUDENT_FEEDBACK}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_COUNSELOR}
        element={
          <ProtectedRoute allowedRoles={[ROLES.COUNSELOR]}>
            <CounselorDashboardPage />
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
            <MentorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_MENTOR_STUDENTS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorStudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_MENTOR_FEEDBACK}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_MENTOR_PORTFOLIO}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorPortfolioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_MENTOR_SETTINGS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorProfileSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_ADMIN}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
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
