import RouteProtectedRoute from "@/routes/ProtectedRoute"

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {
  return <RouteProtectedRoute>{children}</RouteProtectedRoute>
}
