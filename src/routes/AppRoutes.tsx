import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import { useAuth } from "../context/AuthContext"

// Example of a Private Route wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Admin Route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Private Routes */}
      <Route path="/dashboard/*" element={<div>Student Dashboard</div>} />
      {/* Admin Routes */}
      <Route path="/admin" element={<div>Dashboard</div>}>
        {/* <Route index element={<AdminDashboardPage />} /> */}
        {/* Placeholder for future admin pages */}
        <Route
          path="users"
          element={<div className="p-8">User Management (Coming Soon)</div>}
        />
        <Route
          path="roadmaps"
          element={<div className="p-8">Roadmap Management (Coming Soon)</div>}
        />
        <Route
          path="settings"
          element={<div className="p-8">Settings (Coming Soon)</div>}
        />
      </Route>
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
