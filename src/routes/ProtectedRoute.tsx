import React from 'react'
import { Navigate } from 'react-router-dom'
import { RouteProgressBar } from '@/components'
import { useAuth } from '@/context'
import { ROUTES } from '@/shared'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <RouteProgressBar />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (allowedRoles?.length) {
    const userRole = user?.role?.toUpperCase()

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to={ROUTES.DASHBOARD} replace />
    }
  }

  return children
}
