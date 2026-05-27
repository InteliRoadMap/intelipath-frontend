import AuthLayout from '../components/AuthLayout'
import ForgotPasswordForm from '../features/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout view="forgot-password">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
