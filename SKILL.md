# InteliPath Frontend — SKILL Reference

## Stack
- **React 18 + TypeScript** (Vite bundler)
- **TailwindCSS** for styling
- **React Router v6** for routing
- **Axios** for HTTP with custom interceptors
- **React Context API + useReducer** for auth state management

---

## Directory Structure

```
src/
├── api/            # HTTP layer: clients, endpoints, per-domain API modules
├── components/     # Shared UI — split into layouts/ and ui/
├── context/        # React context providers (AuthContext)
├── features/       # Domain modules — each owns components/, hooks/, types/
│   ├── auth/
│   └── admin/
├── lib/            # Low-level utilities (axios factory, generic helpers)
├── pages/          # Thin route wrappers that compose feature components
├── routes/         # Route config (AppRoutes) and guards (ProtectedRoute)
└── shared/         # Cross-domain constants (ROUTES, ROLES) and types
```

Each top-level folder exposes a barrel `index.ts` so import sites stay clean:
```ts
import { authApi, userApi } from '@/api'
import { useAuth } from '@/context'
import { ROUTES, ROLES } from '@/shared'
```

---

## Path Alias

`@/` maps to `src/` — configured in both `vite.config.js` (runtime) and `tsconfig.json` (TypeScript):
```json
// tsconfig.json
"paths": { "@/*": ["./src/*"] }
```
Always use `@/` for cross-folder imports. Never use `../..` relative paths.

---

## API Layer (`src/api/`)

### Two Axios Clients
Defined in `src/api/apiClients.ts`, both built with the `createApiClient` factory from `src/lib/axios.ts`:

| Client | Purpose | Token attached? |
|--------|---------|----------------|
| `publicClient` | Login, Register, Forgot/Reset Password | No |
| `mainClient` | All protected endpoints | Yes — Bearer from localStorage |

Two clients exist to prevent an infinite 401 → refresh → 401 loop on public endpoints.

### Endpoint Constants
All paths live in `src/api/endpoints.ts` as a `const` object:
```ts
ENDPOINTS.AUTH.LOGIN         // '/auth/login'
ENDPOINTS.USERS.ME           // '/users/me'
ENDPOINTS.COUNSELOR_DASHBOARD.METRICS_STUDENTS
ENDPOINTS.MENTOR_DASHBOARD.WELCOME_ALERT
```
Paths are relative (no leading `/api/v1`) — the base URL from `VITE_API_BASE_URL` already includes `/api/v1`.

### Per-Domain API Modules
| File | Client used | Description |
|------|------------|-------------|
| `authApi.ts` | `publicClient` (most), `mainClient` (logout) | Auth endpoints |
| `userApi.ts` | `mainClient` | `GET /users/me` |
| `dashboardApi.ts` | `mainClient` | Student dashboard data |
| `counselorApi.ts` | `mainClient` | Counselor dashboard data |
| `mentorApi.ts` | `mainClient` | Mentor dashboard data |
| `adminApi.ts` | `mainClient` | Admin dashboard data |

---

## Axios Interceptor (`src/lib/axios.ts`)

The `createApiClient` factory wires two interceptors on every client:

**Request interceptor**
1. Logs request method/URL/body in dev (`import.meta.env.DEV` guard; passwords masked)
2. Attaches `Authorization: Bearer <accessToken>` and `x-refresh-token` headers if tokens exist

**Response interceptor**
1. Logs response status/data in dev
2. On **403** — calls `onForbidden` or falls back to `onUnauthorized`
3. On **401** — attempts silent token refresh:
   - Uses a raw `axios.post` (not the client itself) to avoid re-triggering the interceptor
   - Queues concurrent requests while refresh is in-flight (`failedQueue`)
   - On success: updates `localStorage`, retries all queued requests with the new token
   - On failure: calls `onUnauthorized` → clears localStorage → redirects to `/login`

---

## Authentication Flow

### Email/Password (internal)
```
LoginForm → authApi.login() → receives { accessToken, refreshToken, expiresIn }
→ AuthContext.login() → userApi.getMe() → stores user in localStorage + state
→ DashboardPage reads user.role → redirects to role-specific dashboard
```

### OAuth (Google / GitHub)
```
useLogin.ts → window.location.href = `${API_HOST}/oauth2/authorization/google`
→ backend OAuth2 flow
→ redirect to /auth/callback?token=...&refreshToken=...
→ OAuthCallbackPage: jwtDecode(token) to extract role + expiresIn
→ AuthContext.login() → userApi.getMe() → role-based redirect
```
`API_HOST` is derived from `VITE_API_BASE_URL` with the `/api/v1` suffix stripped.

### Shared Login Logic (`AuthContext.login`)
Both flows call the same function:
1. Store `accessToken`, `refreshToken`, `tokenExpiresIn` in `localStorage`
2. Call `GET /users/me` to fetch the full user profile
3. Dispatch `LOGIN` action to update React state
4. Schedule the proactive refresh timer

---

## Auth State (`src/context/AuthContext.tsx`)

Managed by `useReducer` with a typed discriminated union:

```ts
type AuthAction =
  | { type: "LOGIN";        payload: { user: User; accessToken: string; refreshToken: string | null } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING";  payload: boolean }
  | { type: "UPDATE_TOKEN"; payload: { accessToken: string } }
```

**State shape** (from `src/features/auth/types/auth.types.ts`):
```ts
interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
}
```

**Token refresh — two mechanisms:**
1. **Proactive:** `setupRefreshTimer` schedules a refresh 1 second before `tokenExpiresIn` using `window.setTimeout`
2. **Reactive:** Axios interceptor catches 401 and refreshes inline (see above)

On app load, `useEffect` restores state from `localStorage` (user + accessToken must both be present).

---

## Routing (`src/routes/`)

| Path | Access | Component |
|------|--------|-----------|
| `/` | Public | `WelcomePage` |
| `/login` | Public | `LoginPage` |
| `/register` | Public | `RegisterPage` |
| `/forgot-password` | Public | `ForgotPasswordPage` |
| `/reset-password` | Public | `ResetPasswordPage` |
| `/auth/callback` | Public | `OAuthCallbackPage` |
| `/dashboard` | Protected | `DashboardPage` (role-based redirect) |
| `/dashboard/student` | Protected | `StudentDashboard` |
| `/dashboard/counselor` | Protected | `CounselorDashboard` |
| `/dashboard/mentor` | Protected | `MentorDashboard` |
| `/dashboard/admin` | Protected | `AdminDashboard` |

`ProtectedRoute` renders a Bootstrap spinner while `loading: true`, then redirects to `/login` if not authenticated.

---

## Roles & Routes Constants (`src/shared/constants.ts`)

```ts
ROLES = { STUDENT, COUNSELOR, MENTOR, ADMIN }
ROUTES = { HOME, LOGIN, REGISTER, ..., DASHBOARD_STUDENT, DASHBOARD_COUNSELOR, ... }
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full base URL including `/api/v1`, e.g. `http://localhost:8080/api/v1` |

OAuth host is derived at runtime: `VITE_API_BASE_URL.replace('/api/v1', '')`.
