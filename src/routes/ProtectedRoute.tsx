import React from 'react'
import { LoaderCircle } from 'lucide-react'
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
        <div className="animate-pulse rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-lg font-medium">
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin text-slate-500" />
            <span>Loading</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-slate-500" />
          </div>
        </div>
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
