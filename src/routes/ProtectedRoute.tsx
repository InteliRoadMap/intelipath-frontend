import React from 'react'
import { Navigate } from 'react-router-dom'
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
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div
          aria-label="Loading session"
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700"
        />
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
