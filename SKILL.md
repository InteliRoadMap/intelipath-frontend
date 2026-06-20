# InteliPath Frontend - Project Reference

## Stack

- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios 1
- React Context + `useReducer` for authentication
- Shadcn-style UI primitives backed by Radix UI
- Phosphor Icons for new and migrated interface icons

## Project Structure

```text
src/
|-- api/                 # Endpoint constants and per-domain API modules
|-- assets/              # Images, fonts, and robot assets
|-- components/          # Shared layouts, modals, and UI components
|-- config/              # Runtime application configuration
|-- context/             # Global providers such as AuthContext
|-- features/            # Domain modules containing components, hooks, and types
|   |-- auth/
|   |-- admin/
|   `-- student-dashboard/
|-- lib/                 # Axios factory and generic utilities
|-- pages/               # Thin route-level wrappers
|-- routes/              # Route definitions and protected route guard
`-- shared/              # Shared constants and types
```

Use `@/` for imports across folders. Use relative imports only inside the same feature module.

## Feature Module Rules

Feature-specific code belongs under `src/features/<feature-name>/`.

```text
features/student-dashboard/
|-- components/
|   |-- StudentDashboardView.tsx
|   |-- StudentDashboardWidgets.tsx
|   |-- StudentProfileSetupModal.tsx
|   `-- StudentSkillSelectionModal.tsx
|-- hooks/
|   |-- useDashboardData.ts
|   `-- useStudentSetup.ts
|-- types/
|   `-- studentDashboard.types.ts
`-- index.ts
```

- Pages must stay thin and only compose or render feature views.
- API calls, setup checks, and reusable state logic belong in hooks or API modules.
- Domain response types belong in the feature `types/` directory.
- Component filenames must describe their responsibility. Avoid generic names such as `AssessmentModal`.
- Each feature folder exposes a barrel `index.ts`.

## Student Dashboard

`src/pages/StudentDashboard.tsx` is the route wrapper and only renders `StudentDashboardView`.

Responsibilities:

| File | Responsibility |
|------|----------------|
| `StudentDashboardView.tsx` | Dashboard layout, navigation, modal composition, AI Mentor drawer |
| `StudentDashboardWidgets.tsx` | Student dashboard widget presentation |
| `useDashboardData.ts` | Generic widget request state (`loading`, `success`, `error`) |
| `useStudentSetup.ts` | Checks missing student profile and selected skills |
| `StudentProfileSetupModal.tsx` | Two-step student profile form |
| `StudentSkillSelectionModal.tsx` | Skill search and selection |
| `studentDashboard.types.ts` | Dashboard response and setup state types |

The dashboard displays skeletons while data is loading or unavailable. Do not show large red API error messages inside widgets.

## API Layer

All protected requests use `mainClient`; public authentication requests use `publicClient`.

| File | Responsibility |
|------|----------------|
| `apiClients.ts` | Configures public and authenticated Axios clients |
| `endpoints.ts` | Stores relative backend endpoint paths |
| `authApi.ts` | Authentication and refresh requests |
| `userApi.ts` | Current user requests |
| `dashboardApi.ts` | Student dashboard requests |
| `skillApi.ts` | Student skill search and selection |
| `updateApi.ts` | User and student profile updates |
| `adminApi.ts` | Admin dashboard requests |
| `mentorApi.ts` | Mentor dashboard requests |
| `counselorApi.ts` | Counselor dashboard requests |

`VITE_API_BASE_URL` includes `/api/v1`, so endpoint constants must remain relative to that base URL.

## Authentication Flow

Only Google and GitHub OAuth login are currently used.

```text
Login page
-> backend OAuth authorization endpoint
-> provider callback
-> frontend /auth/callback?token=...&refreshToken=...
-> AuthContext.login()
-> GET current user
-> role-specific dashboard
```

Session behavior:

1. Store access token, refresh token, and expiration in `localStorage`.
2. Attach only the access token as `Authorization: Bearer <token>` to protected requests.
3. Refresh the access token shortly before it expires.
4. On `401`, perform one refresh request, queue concurrent requests, then retry them.
5. On `403`, keep the session and reject the unauthorized action.
6. On refresh failure, clear the session and redirect to `/login`.

Never attach the refresh token to normal API requests. Send it only in the `/auth/refresh` request body.

## Student Setup Flow

`useStudentSetup` checks profile and skills after a student enters the dashboard:

1. Request the student profile and selected skills in parallel.
2. Open `StudentProfileSetupModal` when university, admission year, or major is missing.
3. Open `StudentSkillSelectionModal` after profile completion when no skills are selected.
4. Close setup after selected skills are saved.

The profile modal submits user profile and student academic profile only after the final profile step.

## Routing

| Path | Access |
|------|--------|
| `/` | Public |
| `/login` | Public |
| `/forgot-password` | Public |
| `/reset-password` | Public |
| `/auth/callback` | Public |
| `/dashboard` | Protected role redirect |
| `/dashboard/student` | Student |
| `/dashboard/counselor` | Counselor |
| `/dashboard/mentor` | Mentor |
| `/dashboard/admin` | Admin |

`ProtectedRoute` handles authentication. Role-specific pages must also remain protected by role checks.

## Naming And Code Style

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Types: `<domain>.types.ts`
- API modules: `<domain>Api.ts`
- Use English for code comments, JSDoc, logs, and identifiers.
- Keep route pages thin.
- Keep API response normalization outside visual JSX when possible.
- Use primitives from `src/components/ui/` before creating feature-specific buttons, cards, dialogs, inputs, badges, or skeletons.
- Use Phosphor Icons for new UI and when migrating existing screens.
- Preserve responsive behavior for mobile, tablet, and desktop.

## Verification

Run before finishing frontend changes:

```bash
npm run build
git diff --check
```

The current build may report a chunk-size warning above 500 kB; it is not a build failure.
