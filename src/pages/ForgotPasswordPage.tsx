import { AuthLayout } from '@/components'
import { ForgotPasswordForm } from '@/features/auth'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout view="forgot-password">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
