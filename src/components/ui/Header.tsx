import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context'
import Logo from './Logo'
import { ROUTES } from '@/shared'
// import '../styles/welcome.css'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="welcome-header">
      <Logo hideIcon className="!text-slate-900 scale-95 transform origin-left" />

      <nav className="welcome-nav">
        {isAuthenticated ? (
          <>
            <span className="nav-text">Hi, {user?.fullName || 'User'}</span>
            <Link to={ROUTES.DASHBOARD} className="header-btn-register" style={{ marginLeft: '16px' }}>
              Dashboard
            </Link>
            <button
              className="header-btn-signin"
              onClick={handleLogout}
              style={{ marginLeft: '8px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} className="header-btn-signin">
              Sign In
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
