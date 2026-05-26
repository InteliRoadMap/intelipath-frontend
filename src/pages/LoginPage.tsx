import AuthLayout from '../components/AuthLayout'
import LoginForm from "../features/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthLayout view="login">
      <LoginForm />
    </AuthLayout>
  )
}
