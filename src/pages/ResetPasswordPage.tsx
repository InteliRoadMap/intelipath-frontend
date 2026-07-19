import { AuthCardLayout } from '@/components'
import { ResetPasswordForm } from '@/features/auth'

export default function ResetPasswordPage() {
  // Same shell as ForgotPasswordPage so the whole recovery flow looks like one page.
  return (
    <AuthCardLayout>
      <ResetPasswordForm />
    </AuthCardLayout>
  )
}
