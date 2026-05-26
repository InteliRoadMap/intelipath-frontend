import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import '../styles/welcome.css'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="welcome-header">
      <Link to="/" className="header-logo">
        InteliPath
      </Link>

      <nav className="welcome-nav">
        {isAuthenticated ? (
          <>
            <span className="nav-text">Hi, {user?.name || user?.email || 'User'}</span>
            <button
              className="header-btn-signin"
              onClick={handleLogout}
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
        <button className="dark-mode-toggle" title="Toggle dark mode">
          🌙
        </button>
      </nav>
    </header>
  )
}
