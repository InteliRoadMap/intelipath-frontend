import { AuthLayout } from '@/components'
import { LoginForm } from "@/features/auth"

export default function LoginPage() {
  return (
    <AuthLayout view="login">
      <LoginForm />
    </AuthLayout>
  )
}
