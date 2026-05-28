import AuthLayout from "../components/AuthLayout"
import RegisterForm from "../features/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthLayout view="register">
      <RegisterForm />
    </AuthLayout>
  )
}
