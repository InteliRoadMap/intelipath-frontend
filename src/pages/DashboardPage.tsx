import { useAuth } from '../store/AuthContext'
import { Navigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()

  const role = user?.role?.toUpperCase() || 'STUDENT'

  if (role === 'ADMIN') {
    return <Navigate to="/dashboard/admin" replace />
  } else if (role === 'MENTOR') {
    return <Navigate to="/dashboard/mentor" replace />
  } else if (role === 'COUNSELOR') {
    return <Navigate to="/dashboard/counselor" replace />
  } else {
    return <Navigate to="/dashboard/student" replace />
  }
}
