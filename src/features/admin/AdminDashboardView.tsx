import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Gauge,
  GraduationCap,
  Layout,
  MagnifyingGlass,
  PencilSimple,
  Pulse,
  ShieldCheck,
  Trash,
  UsersThree
} from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import { adminApi } from "@/api"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardUserActions,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Logo,
  Skeleton
} from "@/components"
import { useAuth } from "@/context"
import { ROLES, ROUTES } from "@/shared"
import type {
  AdminCourseMetric,
  AdminRole,
  AdminSystemHealth,
  AdminUserListItem,
  AdminUserMetric
} from "./admin.types"

const USERS_PER_PAGE = 7
const ADMIN_ROLE_OPTIONS = [
  ROLES.STUDENT,
  ROLES.COUNSELOR,
  ROLES.MENTOR,
  ROLES.ADMIN
] as AdminRole[]

const roleVariant = (role: AdminRole) => {
  if (role === "ADMIN") return "destructive"
  if (role === "MENTOR") return "info"
  if (role === "COUNSELOR") return "warning"
  return "default"
}

type MetricCardProps = {
  label: string
  value?: string
  status?: ReactNode
  icon: ReactNode
  iconClassName: string
  isLoading: boolean
  isUnavailable?: boolean
  progress?: number
  progressClassName?: string
}

function MetricCard({
  label,
  value,
  status,
  icon,
  iconClassName,
  isLoading,
  isUnavailable = false,
  progress,
  progressClassName = "bg-cyan-700"
}: MetricCardProps) {
  return (
    <Card className="min-h-[118px] overflow-hidden transition-colors hover:border-slate-300 hover:shadow-md">
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${iconClassName}`}>
              {icon}
            </div>
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-16 shrink-0" />
          ) : isUnavailable ? (
            <Badge className="shrink-0">Unavailable</Badge>
          ) : (
            status
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <p className="font-display text-2xl font-semibold leading-none text-slate-950">
            {isUnavailable ? "--" : value}
          </p>
        )}

        {progress !== undefined && !isUnavailable && (
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${progressClassName}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AdminMetrics({ className = "" }: { className?: string }) {
  const [users, setUsers] = useState<AdminUserMetric | null>()
  const [courses, setCourses] = useState<AdminCourseMetric | null>()
  const [health, setHealth] = useState<AdminSystemHealth | null>()

  useEffect(() => {
    void adminApi.getTotalUsers().then(setUsers).catch(() => setUsers(null))
    void adminApi.getTotalCourses().then(setCourses).catch(() => setCourses(null))
    void adminApi.getSystemHealth().then(setHealth).catch(() => setHealth(null))
  }, [])

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${className}`}>
      <MetricCard
        label="Total users"
        value={(users?.total ?? 0).toLocaleString()}
        status={users && <Badge variant="info">+{users.growth}%</Badge>}
        icon={<UsersThree size={20} weight="duotone" />}
        iconClassName="bg-cyan-50 text-cyan-700"
        isLoading={users === undefined}
        isUnavailable={users === null}
      />
      <MetricCard
        label="Courses"
        value={String(courses?.total ?? 0)}
        status={courses && <Badge variant="success">{courses.status}</Badge>}
        icon={<BookOpen size={20} weight="duotone" />}
        iconClassName="bg-emerald-50 text-emerald-700"
        isLoading={courses === undefined}
        isUnavailable={courses === null}
        progress={courses?.progress}
        progressClassName="bg-emerald-600"
      />
      <MetricCard
        label="System health"
        value={`${health?.uptime ?? 0}%`}
        status={health && (
          <Badge variant="success" className="gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {health.status || "Online"}
          </Badge>
        )}
        icon={<Gauge size={20} weight="duotone" />}
        iconClassName="bg-violet-50 text-violet-700"
        isLoading={health === undefined}
        isUnavailable={health === null}
      />
    </div>
  )
}

function UserManagement() {
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null)
  const [selectedRole, setSelectedRole] = useState<AdminRole>("STUDENT")
  const [roleError, setRoleError] = useState("")
  const [isSavingRole, setIsSavingRole] = useState(false)
  const [deletingUser, setDeletingUser] = useState<AdminUserListItem | null>(null)
  const [deleteError, setDeleteError] = useState("")
  const [isDeletingUser, setIsDeletingUser] = useState(false)

  useEffect(() => {
    void adminApi.getUsersList()
      .then((response) => setUsers(Array.isArray(response) ? response : []))
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    return keyword
      ? users.filter((user) =>
        user.name.toLowerCase().includes(keyword) ||
        (user.email || "").toLowerCase().includes(keyword)
      )
      : users
  }, [users, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE)
  const visibleStart = filteredUsers.length ? startIndex + 1 : 0
  const visibleEnd = Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)

  const openRoleEditor = (user: AdminUserListItem) => {
    setEditingUser(user)
    setSelectedRole(user.role)
    setRoleError("")
  }

  const saveRole = async () => {
    if (!editingUser) return
    setIsSavingRole(true)
    setRoleError("")
    try {
      const updatedUser = await adminApi.updateUserRole(editingUser.id, selectedRole)
      setUsers((current) => current.map((user) => user.id === editingUser.id ? { ...user, ...updatedUser } : user))
      setEditingUser(null)
    } catch {
      setRoleError("Could not update user role. Please try again.")
    } finally {
      setIsSavingRole(false)
    }
  }

  const deleteUser = async () => {
    if (!deletingUser) return
    setIsDeletingUser(true)
    setDeleteError("")
    try {
      await adminApi.deleteUser(deletingUser.id)
      setUsers((current) => current.filter((user) => user.id !== deletingUser.id))
      setDeletingUser(null)
    } catch {
      setDeleteError("Could not delete this account. Please try again.")
    } finally {
      setIsDeletingUser(false)
    }
  }

  return (
    <>
      <Card className="mt-4 overflow-hidden xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
        <CardHeader className="gap-4 border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle>User management</CardTitle>
            <CardDescription>
              Showing {visibleStart} to {visibleEnd} of {filteredUsers.length} users
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={safeCurrentPage === 1 || !filteredUsers.length} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                <ArrowLeft size={15} weight="bold" />
              </Button>
              <span className="min-w-24 text-center text-xs font-semibold text-slate-600">
                Page {safeCurrentPage} of {totalPages}
              </span>
              <Button variant="outline" size="icon" disabled={safeCurrentPage === totalPages || !filteredUsers.length} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
                <ArrowRight size={15} weight="bold" />
              </Button>
            </div>
            <div className="flex h-10 w-full items-center gap-2.5 rounded-md border border-slate-200 bg-white px-3 transition focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-600/15 sm:w-72">
              <MagnifyingGlass className="shrink-0 text-slate-400" size={17} />
              <Input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search users by name or email"
                className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none focus:border-0 focus:ring-0"
              />
            </div>
          </div>
        </CardHeader>

        <div className="relative xl:min-h-0 xl:flex-1">
          <div className="max-h-[calc(100vh-330px)] min-h-[280px] overflow-auto xl:h-full xl:max-h-none xl:min-h-0">
          <table className="w-full min-w-[860px] table-fixed text-left">
            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-5 py-4"><Skeleton className="h-9 w-48" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-6 w-20" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="px-5 py-4"><Skeleton className="ml-auto h-8 w-40" /></td>
                </tr>
              ))}
              {!isLoading && paginatedUsers.map((user) => (
                <tr key={user.id} className="h-[72px] transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">
                        {user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{user.name}</p>
                        <p className="max-w-[260px] truncate text-xs text-slate-400">
                          {user.email || `ID: ${user.id.slice(0, 8)}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle"><Badge variant={roleVariant(user.role)}>{user.role}</Badge></td>
                  <td className="px-5 py-4 align-middle text-sm text-slate-500">{user.joinedDate}</td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex min-w-[190px] items-center justify-end gap-2">
                      <Button className="w-[100px]" variant="outline" size="sm" onClick={() => openRoleEditor(user)}>
                        <PencilSimple size={14} weight="bold" /> Edit role
                      </Button>
                      <Button variant="outline" size="sm" className="w-[100px] border-rose-100 text-rose-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={() => setDeletingUser(user)}>
                        <Trash size={14} weight="bold" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && paginatedUsers.length === 0 && (
            <div className="grid min-h-64 place-items-center px-5 text-center">
              <div>
                <MagnifyingGlass className="mx-auto text-slate-300" size={32} weight="duotone" />
                <p className="mt-3 text-sm font-semibold text-slate-700">No users found</p>
                <p className="mt-1 text-xs text-slate-500">Try another name or email.</p>
              </div>
            </div>
          )}
          </div>
          {!isLoading && paginatedUsers.length > 4 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white via-white/85 to-transparent" />
          )}
        </div>
      </Card>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && !isSavingRole && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user role</DialogTitle>
            <DialogDescription>Change access permissions for {editingUser?.name}.</DialogDescription>
          </DialogHeader>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Role</label>
          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value as AdminRole)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15"
          >
            {ADMIN_ROLE_OPTIONS.map((role) => <option key={role}>{role}</option>)}
          </select>
          {roleError && <p className="mt-3 text-sm font-medium text-rose-600">{roleError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={isSavingRole} onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button variant="brand" disabled={isSavingRole} onClick={saveRole}>{isSavingRole ? "Saving..." : "Save role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && !isDeletingUser && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>This permanently removes the user and cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-800">{deletingUser?.name}</p>
            <p className="mt-1 text-xs text-rose-600">Role: {deletingUser?.role}</p>
          </div>
          {deleteError && <p className="mt-3 text-sm font-medium text-rose-600">{deleteError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={isDeletingUser} onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button variant="destructive" disabled={isDeletingUser} onClick={deleteUser}>{isDeletingUser ? "Deleting..." : "Delete account"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function AdminDashboardView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-14 font-sans text-slate-950 xl:h-screen xl:overflow-hidden xl:pb-0">
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Logo hideIcon className="origin-left scale-90" />
            <nav className="hidden items-center gap-8 lg:flex">
              {[
                [Layout, "Overview", true],
                [UsersThree, "Users", false],
                [GraduationCap, "Courses", false],
                [Pulse, "System health", false]
              ].map(([Icon, label, active]) => {
                const NavIcon = Icon as typeof Layout
                return (
                  <button
                    key={String(label)}
                    className={`relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                      active
                        ? "border-cyan-700 text-cyan-800"
                        : "border-transparent text-slate-500 hover:text-slate-950"
                    }`}
                  >
                    <NavIcon size={17} weight="duotone" />
                    {String(label)}
                  </button>
                )
              })}
            </nav>
          </div>
          <DashboardUserActions user={user} onLogout={handleLogout} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-5 md:px-8 xl:flex xl:h-[calc(100vh-72px)] xl:min-h-0 xl:flex-col xl:overflow-hidden">
        <section className="mb-4 grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <div className="py-1">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              <ShieldCheck size={16} weight="duotone" /> Administration
            </div>
            <h1 className="font-display text-2xl font-semibold leading-tight text-slate-950">
              System overview
            </h1>
            <p className="mt-2 max-w-[280px] text-sm leading-5 text-slate-500">
              Monitor platform health and manage user access.
            </p>
          </div>
          <AdminMetrics className="min-w-0" />
        </section>
        <UserManagement />
      </main>
    </div>
  )
}
