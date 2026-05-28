import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import Logo from './Logo'
// import '../styles/welcome.css'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="welcome-header">
      <Logo hideIcon className="!text-slate-900 scale-95 transform origin-left" />

      <nav className="welcome-nav">
        {isAuthenticated ? (
          <>
            <span className="nav-text">Hi, {user?.fullName || user?.name || 'User'}</span>
            <Link to="/dashboard" className="header-btn-register" style={{ marginLeft: '16px' }}>
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
            <Link to="/login" className="header-btn-signin">
              Sign In
            </Link>
            <Link to="/register" className="header-btn-register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
