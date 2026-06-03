import { useAuth } from '@/context'
import { Navigate } from 'react-router-dom'
import { ROLES, ROUTES } from '@/shared'

export default function DashboardPage() {
  const { user } = useAuth()

  const role = user?.role?.toUpperCase() || ROLES.STUDENT

  if (role === ROLES.ADMIN) {
    return <Navigate to={ROUTES.DASHBOARD_ADMIN} replace />
  } else if (role === ROLES.MENTOR) {
    return <Navigate to={ROUTES.DASHBOARD_MENTOR} replace />
  } else if (role === ROLES.COUNSELOR) {
    return <Navigate to={ROUTES.DASHBOARD_COUNSELOR} replace />
  } else {
    return <Navigate to={ROUTES.DASHBOARD_STUDENT} replace />
  }
}
